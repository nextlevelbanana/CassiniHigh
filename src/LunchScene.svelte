<script>
    // import {fly} from "svelte/transition";
    import { currentScene, currentDay, days, kids, threshholds, reps, item, name, hair, top, bottom, feet } from "./store";
    import {getItemName} from "./helpers.js";

    let isStanding = true;
    let currentMood;
    let showArrow = "";
    let localKids = ["turbo", "floof", "morm", "invisigoth", "alone"]
    let asking;
    let canTalk = {floof: true, invisigoth: true, morm: true, turbo: true, alone: true};
    let dialogs;
    let responseLine;
    let response2;
    let bgMusic;

    const sitWith = async (kid) => {
        if (kid == "alone") {
            eatAlone();
        }
        getCurrentMood(kid);
        await calculateOutfit(kid);
        await askToSit(kid);
        await hearResponse(kid);
        recalculateMood();
        ifStandingRemoveFromOptions();
    }

    let stores;
    $: stores = {
        hair: $hair,
        top: $top,
        bottom: $bottom,
        feet: $feet,
        turbo: $reps.turbo,
        floof: $reps.floof,
        invisigoth: $reps.invisigoth,
        morm: $reps.morm
    }

    let score;
    let min;
    const calculateOutfit = async kid => {
        if (kid == "alone") return;
        score = 0;
        min = null;
        var json = await (await fetch(`./assets/characters/${kid}/scores.json`)).json();
        for (const [key,slot] of Object.entries(json)) {
            const itemScore = slot.find(item => item.id == stores[key]).score;
            score += itemScore;
            if (!min || itemScore < min.score ) {
                min = {key: key, score: itemScore}
            }
        }

        item.set(getItemName(min.key, stores[min.key]));
       
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
        bgMusic = `./assets/music/${kid}.wav`;
        showArrow = ""; 
        asking = kid;
        await sleep(2400);
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
        await sleep(900/$reps[kid]);

       responseLine = dialogs[currentMood].replaceAll("$name", $name).replaceAll("$item", $item);
        await sleep(3000);

        if (currentMood == "like" || (currentMood == "unsure" && dialogs.canSitOnUnsure)) {
            response2 = "Really? I mean, oh, rad, thanks!";
            isStanding = false;
        } else {
            response2 = "Oh... ok... sorry to bother you..."
            isStanding = true;
        }
    }

    const recalculateMood = async (kid) => {
        return await "";
    }

    const ifStandingRemoveFromOptions = (kid) => {
        canTalk[kid] = false;
    }

    const eatAlone = () => {
        response2 = "The truly cool kids can eat by themselves with confidence. ...Right?";
        isStanding = false;
    }

    const moveOn = (kid) => {
        if (!isStanding) {
            currentDay.set($currentDay + 1);
            if ($currentDay > 5) {
                currentDay.set(5);
                currentScene.set("outro");
            } else {
                currentScene.set("closet");
            }
        } else {
            bgMusic = null;
            asking = false;
            delete canTalk[kid];
            responseLine = "";
            response2 = "";
        }
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
        width: 890px;
        border: 0;
        background-color: transparent;
        height: 100%;
        display: flex;
        justify-content: center;
    }

    .tableContainer button:hover {
        outline: none;
    }

    .buttons {
        display: inline-flex;
        height: 800px;
        padding-left: 280px;
        margin-top: 100px;
    }

    .you {
        background-color: aquamarine;
        border-radius: 10%;
        padding: 2rem;
        max-width:100%;
        min-width: 600px;
        position: relative;
    }

    button.you:hover {
        background-color: lightgreen;
    }

    .tiny {
        font-size: 24px;
    }

    .them {
        border-radius: 10%;
        background-color: aqua;
        padding: 2rem;
        margin: 1rem;
    }
</style>

<h1>Lunch time! Who should I try and sit with...?</h1>
{#if bgMusic}
    <audio src={bgMusic} autoplay=true loop="true"/>
{/if}
<div class="tableContainer">
    <div class="buttons">
        {#each localKids as kid}
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <button on:mouseover={() => showArrow = kid} on:click|once={async () => await sitWith(kid)}>
            &nbsp;
            {#if showArrow == kid && canTalk[kid] && !asking}
                <img src="assets/images/lunch/lunch_talk.png"/>
            {/if}
            <div class="convo">
                {#if asking && asking == kid}
                    {#if kid != "alone"}
                    <div class="you">Can I eat with you?</div>
                    {/if}
                        {#if responseLine}
                            <div class="them">{responseLine}</div>
                        {/if}
                    {#if response2}
                    <button class="you" on:click={() => moveOn(kid)}>{response2} <span class="tiny">(click to continue)</span></button>
                    {/if}
                {/if}
            </div>
        </button>
            
        {/each}
    </div>
</div>