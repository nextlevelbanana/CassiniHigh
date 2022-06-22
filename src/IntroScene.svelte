<script>
    import { afterUpdate } from "svelte";
    import {fade} from "svelte/transition";
    import {goalGroup, currentScene, currentDay, kids} from "./store.js";
    import PickAKid from "./PickAKid.svelte";
import App from "./App.svelte";
    let conversations;
    let lines = [];
    let currentConvo = 0;
    let idx = 0;
    let showOverlay = false;
    let staging = "";
    let cursor = 0;
    let showEnter;
    let canType = true;
    let chat;
    let showSkip = false;
    let showPlaceholder = true;
    let moving = false;

    const getConversations = async () => {
        const json = await (await fetch("assets/data/intro.json")).json();
        conversations = [json.conversation, json.conversation2];
        conversations[1] = conversations[1].map(line => {
            return {speaker: line.speaker, text: line.text.replaceAll("$scene", $goalGroup)}
        })
       return advanceConvo();
    }

    const sendEnter = async () => {
        const sfx = new Audio("./assets/sounds/imsend.wav");
        sfx.loop = false;
        sfx.play();
        const line = conversations[currentConvo][idx];
        staging = "";
        lines = [...lines, line];
        idx++;
        cursor = 0;
        showEnter = false;
        canType = false;
        await sleep(1200);
        advanceConvo();
    }

    afterUpdate(() => {
       chat && chat.scrollTo(0, chat.scrollHeight);
    });

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function sleep(ms) {
        await timeout(ms);
        return;
    }

    const advanceConvo = async (ev) => {
        if (showOverlay) return;
        const line = conversations[currentConvo][idx];
        if (!line) {
            if (currentConvo == 0) {
                sleep(600);
                showOverlay = true;
                idx = 0;
                currentConvo = 1;
                canType = true;
            } else {
                canType = false;
                sleep(1200);
                return moveOn();
            }
        } else {
            if (line.speaker == "you" && canType) {
                showPlaceholder = false;

                if (cursor > line.text.length - 1) {
                    if (ev.key == "Enter") {
                       await sendEnter();
                    }
                } else {
                    staging += line.text[cursor];
                    cursor++;
                    if (cursor > line.text.length - 1) {
                        showEnter = true;
                    }
                }
            } else if (line.speaker == "them") {
                lines = [...lines, line];
                const sfx = new Audio("./assets/sounds/imrcv.wav");
                sfx.loop = false;
                sfx.play();
                idx++;
                canType = true;
            }
        }
    }

    const moveOn = () => {
        currentDay.set(1);
        currentScene.set("closet");
    }
</script>

<style>
    .placeholder {
        font-size: 48px;
        color: gray;
    }
    .overlay {
        height: calc(100vh - 3rem);
        width: 100vw;
        z-index: 50;
        position: fixed;
        background-color: azure;
        top: 0;
        left: 0;
        background-image: url("../assets/images/closet_background.png");
        margin: 1rem auto;
        text-align: center;

    }
    .you {
        text-align: left;
        color: darkgreen;
        padding: 0.5rem 0;
    }
    .them {
        text-align: right;
        color: darkmagenta;
    }
    .chat {
        background-color: lightblue;
        font-size: 48px;
        height: calc(100vh - 400px);
        overflow-y: auto;
        width: 80%;
        padding: 1rem;
    }
    .staging {
        width: 80%;
        height: 300px;
        margin-top: 2rem;
        /* margin: 2rem; */
        font-size: 48px;
        display: inline-flex;
        border: 5px solid gray;
        align-items: center;
    }
    .staging .line {
        padding: 1rem;
        flex-grow: 1;
        overflow-y: auto;
    }
    .staging button {
        height: 100%;
        margin-bottom: 0;
    }

    .cursor {
        animation: cursor-blink 1s steps(2, start) infinite;
    }

    @keyframes cursor-blink {
    to {
        opacity: 0;
    }
}

</style>

<svelte:window on:keypress={advanceConvo}/>
{#if !showOverlay}
    {#await getConversations() then value}
        <div class="chat" bind:this={chat}>
            {#each lines as line}
                <div class={line.speaker} in:fade="{{duration: 50}}">{line.text}</div>
            {/each}    
        </div>   
        <div class="staging">
            {#if showPlaceholder}
            <div class="placeholder line">(type in here)</div>
            {/if}
            <div class="line">
                {staging}{#if canType}<span class="cursor">|</span>{/if}
            </div>
            <button disabled={!showEnter} on:click={sendEnter}>SEND</button>
        </div>
    {/await}
    <button class="skip" on:click={() => showSkip = true}>(skip intro)</button>
{:else}
    <div class="overlay" in:fade>
        <PickAKid bind:showOverlay={showOverlay}/>
    </div>
{/if}

{#if showSkip}
<div class="overlay">
    <h1>Which group are you going to befriend?</h1>
    <select bind:value={$goalGroup}>
        {#each $kids as kid}
            <option value={kid}>
                {kid}
            </option>
        {/each}
    </select>
    <button on:click={moveOn}>let's go</button>
</div>
{/if}