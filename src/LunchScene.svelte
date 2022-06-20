<script>
    // import {fly} from "svelte/transition";
import { currentScene, currentDay, days, kids, threshholds, reps } from "./store";

    let isStanding = true;
    let currentMood;
    let showArrow = "";
    let localKids = ["turbo", "floof", "morm", "invisigoth", "alone"]
    let asking;
    let canTalk = {floof: true, invisigoth: true, morm: true, turbo: true, alone: true};
    let dialogs;
    let responseLine;
    let response2;

    $: if (!isStanding) {
        currentDay.set($currentDay + 1);
        if ($currentDay > 5) {
            currentScene.set("outro");
        } else {
            currentScene.set("closet");
        }
    }

    const sitWith = async (kid) => {
        if (kid == "alone") {
            eatAlone();
        }
        getCurrentMood(kid);
        await askToSit(kid);
        await hearResponse(kid);
        recalculateMood();
        ifStandingRemoveFromOptions();
    }

    const getCurrentMood = async (kid) => {
        if ($reps[kid] < $threshholds.unsure) {
            currentMood = "dislike";
        } else if ($reps[kid] >= $threshholds.like) {
            currentMood = "like";
        } else {
            currentMood = "unsure";
        }
    }

    const askToSit = async (kid) => {
        showArrow = ""; 
        asking = kid;
        await sleep(400);
        dialogs = await (await fetch(`./assets/characters/${kid}/dialog_lunch_1.json`)).json();
    }

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function sleep(ms) {
        await timeout(ms);
        return;
    }


    const hearResponse = async (kid) => {
        responseLine = "...";
        await sleep(700/$reps[kid]);

       responseLine = dialogs[currentMood];
        await sleep(1000);

        if (currentMood == "like" || (currentMood == "unsure" && dialogs.canSitOnUnsure)) {
            response2 = "Really? I mean, oh, rad, thanks!";
            await sleep(3000);
            isStanding = false;
        } else {
            response2 = "Oh... ok... sorry to bother you..."
            await sleep(2000);
            asking = false;
            delete canTalk[kid];
            responseLine = "";
            response2 = "";
        }
    }

    const recalculateMood = async (kid) => {
        return await "";
    }

    const ifStandingRemoveFromOptions = (kid) => {
        canTalk[kid] = false;
    }

    const eatAlone = () => {
        displayInternalMonologue();
        moveOn();
    }

</script>

<style>
    .tableContainer {
        height: 900px;
        overflow-x: auto;
        background-image: url("../assets/images/lunch/table.png");
        background-attachment: local;
        background-position: left top;
        background-repeat: no-repeat;
    }

    button {
        z-index: 1;
        width: 800px;
        border: 0;
        background-color: transparent;
        height: 100%;
    }

    .buttons {
        display: inline-flex;
        height: 800px;
        padding-left: 250px;
        margin-top: 100px;
    }

    .you {
        background-color: aquamarine;
        border-radius: 10%;
        padding: 2rem;
        max-width: 600px;
        min-width: 600px;
        position: relative;
    }

    .them {
        border-radius: 10%;
        background-color: aqua;
        padding: 2rem;
        margin: 1rem;
    }
</style>

<h1>LUNCH TIME! Who should I try and sit with...? {currentMood}</h1>
<div class="tableContainer">
    <div class="buttons">
        {#each localKids as kid}
        <button on:mouseover={() => showArrow = kid} on:click={async () => await sitWith(kid)}>
            &nbsp;
            {#if showArrow == kid && canTalk[kid] && !asking}
                <img src="assets/images/lunch/lunch_talk.png"/>
            {/if}
            {#if asking == kid}
                <div class="you">Can I eat with you?</div>
                {#if responseLine}
                    <div class="them">{responseLine}</div>
                {/if}
                {#if response2}
                <div class="you">{response2}</div>
            {/if}
            {/if}
        </button>
            
        {/each}
    </div>
</div>