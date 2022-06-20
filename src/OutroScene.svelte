<script>
    import { afterUpdate } from "svelte";
    import {fade} from "svelte/transition";
    import {goalGroup, currentScene, currentDay, threshholds, reps, kids} from "./store.js";
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
    let json;


    const getConversations = async () => {
        json = await (await fetch("assets/data/outro.json")).json();
        conversations = [json.conversation];
        getFinalStanding();
       return advanceConvo();
    }

    const getFinalStanding = () => {
        const standingWithGoalGroup = $reps[$goalGroup];
        //you made friends with your group
        if (standingWithGoalGroup >= $threshholds.like) {
            const newLines = json.win.map(line => ({speaker: line.speaker, text: line.text.replaceAll("$scene", $goalGroup)}));
            conversations.push(newLines);
        } else {
            const somebody = whoLikesYou();
            if (somebody) {
                conversations.push(json.weirdWin.map(line => {
                    return {speaker: line.speaker, text: line.text.replaceAll("$scene2", somebody).replaceAll("$scene", $goalGroup)
                    }}));
            } else {
                conversations.push(json.lose.map(line => ({speaker: line.speaker, text: line.text.replaceAll("$scene", $goalGroup)})));
            }
        }
    }

    const whoLikesYou = () => {
        let group;
        for (const [key,value] of Object.entries($reps)) {
            if (value >= $threshholds.like && (!group || value > group)) {
                group = key;
            }
        }
        return group;
    }

    const sendEnter = async () => {
        const line = conversations[currentConvo][idx];
        staging = "";
        lines = [...lines, line];
        idx++;
        cursor = 0;
        showEnter = false;
        canType = false;
        await sleep(1000);
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
                sleep(300);
                // showOverlay = true;
                idx = 0;
                currentConvo = 1;
                canType = true;
            } else {
                sleep(600);
                moveOn();
            }
        } else {
            if (line.speaker == "you" && canType) {
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
                idx++;
                canType = true;
            }
        }
    }

    const moveOn = () => {
        //todo: show pic of group
        currentScene.set("credits");
    }
</script>

<style>
    .overlay {
        height: calc(100vh - 3rem);
        width: 100vw;
        z-index: 50;
        position: fixed;
        background-color: azure;
        top: 0;
        left: 0;

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
            <div class="line">
                {staging}{#if canType}<span class="cursor">|</span>{/if}
            </div>
            <button disabled={!showEnter} on:click={sendEnter}>SEND</button>
        </div>
    {/await}
{:else}
    <div class="overlay" in:fade>

    </div>
{/if}