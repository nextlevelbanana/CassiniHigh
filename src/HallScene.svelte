<script>
    import Player from "./Player.svelte";
    import {name, kids, currentScene, hair, top, bottom, feet, reps, threshholds, counts} from "./store.js";
    
    const bgMusic = null;

    let localKids = [...$kids];

    let stores;
    $: stores = {
        hair: $hair,
        top: $top,
        bottom: $bottom,
        feet: $feet,
        turbo: $reps.turbo,
        floof: $reps.floof
    }

    console.log(stores);

    let score = 0;
    let showYou = false;
    
    let them = [];
    let you = [];

    let currentKid;
    let weights;
    let showDoneWithKidButton;

    const advance = () => {
        currentScene.set("lunch");
    }

    const talkTo = async (kid) => {
        them = [];
        currentKid = kid;
        const outfitScore = await calculateOutfit(kid);
        const newAttitude = calculateNewAttitude(kid, outfitScore);
        await loadCorrectDialog(kid, newAttitude);
        weights = await (await fetch(`./assets/characters/${kid}/opinions.json`)).json();
    }

    let max;
    let min;
    const calculateOutfit = async kid => {
        score = 0;
        max = null;
        min = null;
        var json = await (await fetch(`./assets/characters/${kid}/scores.json`)).json();
        for (const [key,slot] of Object.entries(json)) {
            const itemScore = slot.find(item => item.id == stores[key]).score;
            score += itemScore;
            if (!max || itemScore > max.score) {
                max = {key: key, score: itemScore}
            }
            if (!min || itemScore < min.score ) {
                min = {key: key, score: itemScore}
            }
        }
        score = score/4;
        return score;
    }

    const calculateNewAttitude = (kid) => {
        const rep = stores[kid];
        const newRep = Number((score * 0.65 + rep * 0.35).toFixed(2));
        score = newRep;
        $reps[kid] = newRep;
        $reps = {...$reps};
        console.log($reps);
        //eval(key).set(newRep);
        return newRep;
    }

    let json;
    const loadCorrectDialog = async (kid, newAttitude) => {
        const mood = newAttitude >= $threshholds.like
            ? "like" 
            : (newAttitude <= $threshholds.unsure ? 
                "dislike" : "unsure"); 
        $counts[kid][mood] += 1;
        json = await (await fetch(`./assets/characters/${kid}/dialog_${mood}_1.json`)).json();
        them = [json.opener.replaceAll("$name", $name)];
        you = [{rank: "good", value: json.good}, {rank: "bad", value: json.bad}, {rank: "what", value: json.what}].sort(shuffle );
        showYou = true;
    }       

    const talk = rank => {
        you = [you.find(opt => opt.rank == rank)];
        them = [...them, json["on" + rank]];
        calculateNewRep(rank);
        giveTip();
        showDoneWithKidButton = true;
    }

    const giveTip = () => {
        if (min.score < 0.45) {
            them = [...them, json.badTip.replaceAll("$name", keyToFit[min.key])];
        } else if (max.score > 0.75) {
            them = [... them, json.goodTip.replaceAll("$name", keyToFit[max.key])];
        }
    }

    const keyToFit = {
        hair: "hair",
        top: "shirt",
        bottom: "pants",
        feet: "shoes"
    }

    const calculateNewRep = rank => {
        let newRep = stores[currentKid];
        switch (rank){
            case "good":
                newRep += weights.good;
                break;
            case "bad":
                newRep += weights.bad;
                break;
            case "what":
                newRep += weights.what;
                break;
        }
        $reps = {...$reps, [currentKid]: newRep};
        console.log($reps);

    }

    const shuffle = () => Math.random() - 0.5;
    const clearKid = () => {
        score = 0;
        you = [];
        them = [];
        localKids = localKids.filter(k => k != currentKid);
        currentKid = null;
        showDoneWithKidButton = false;
    }

</script>

<style>
    .playerContainer {
        position: absolute;
        top: 30px;
        left: 100px;
        display: inline-flex;
    }

    .doneButton {
        border: 1px solid lime;
        position: absolute;
        bottom: 10px;
        right: 10px;
    }

    .wave {
        position: absolute;
        right: 0;
    }

    .wave button:hover {
        box-shadow: 0 0 5px 10px cyan;
    }

    .them {
        position: absolute;
        left: 1300px;
        top: 100px;
      
        font-size: 48px;
        min-width: 600px;
        max-width: 600px;
    }
    .them .line {
        border-radius: 10%;
        background-color: aqua;
        padding: 2rem;
        margin: 1rem;
    }

    .you {
        position: absolute;
        font-size: 48px;
        left: 600px;
        top: 200px;
        max-width: 600px;
        min-width: 600px;
    }

    .you button {
        background-color: aquamarine;
        border-radius: 10%;
        padding: 2rem;
        max-width: 600px;
        min-width: 600px;
        position: relative;
    }
    .you button:hover {
        background-color: lightgreen;
    }
    .you .doneButton {

    }
</style>

<audio src={bgMusic} autoplay=true loop="true"/>

<div class="playerContainer">
    <Player></Player>
</div>
<div class="wave">
{#each localKids as kid}
    <button on:click={async () => await talkTo(kid)}>👋 {kid} </button>
{/each}
</div>
<div class="them">
    {#each them as line}
    <div class="line">{line}</div>
    {/each}
</div>
    {#if showYou}
        <div class="you">

            {#each you as option}
                <button on:click={() => talk(option.rank)}>{option.value}</button>
            {/each}
            {#if showDoneWithKidButton}
            <button class="doneButton" on:click={clearKid}>Bye!</button>
                {/if}
        </div>
    {/if}

{#if !currentKid}
    <button class="doneButton" on:click={advance}>That's enough talking for one day. Time for lunch...</button>
{/if}
