<script>
    import Player from "./Player.svelte";
    import {name, currentScene, hair, top, bottom, feet, metalRep, floofRep, cyberRep, fancyRep, threshholds, counts} from "./store.js";

    
    const bgMusic = null;

    const kids = ["metal", "floof", "cyber", "fancy"];

    let stores;
    $: stores = {
        hair: $hair,
        top: $top,
        bottom: $bottom,
        feet: $feet,
        floofRep: $floofRep,
        fancyRep: $fancyRep,
        cyberRep: $cyberRep,
        metalRep: $metalRep
    }

    let score = 0;
    let showYou = false;
    
    let them = [];
    let you = [];

    const advance = () => {
        currentScene.set("lunch");
    }

    const talkTo = async (kid) => {
        them = [];
        const outfitScore = await calculateOutfit(kid);
        const newAttitude = calculateNewAttitude(kid, outfitScore);
        await loadCorrectDialog(kid, newAttitude);
    }

    const calculateOutfit = async kid => {
        score = 0;
        var json = await (await fetch(`./assets/characters/${kid}/scores.json`)).json();
        for (const [key,slot] of Object.entries(json)) {
            score += slot.find(item => item.id == stores[key]).score;
        }
        score = score/4;
        return score;
    }

    const calculateNewAttitude = (kid, outfitScore) => {
        const key = kid + "Rep"
        const rep = stores[key];
        const newRep = Number((outfitScore * 0.65 + rep * 0.35).toFixed(2));
        eval(key).set(newRep);
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
    }

    const shuffle = () => Math.random() - 0.5;

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
    }
    .you button:hover {
        background-color: lightgreen;
    }
</style>

<audio src={bgMusic} autoplay=true loop="true"/>

<div class="playerContainer">
    <Player></Player>
</div>
<div class="wave">
{#each kids as kid}
    <button on:click={async () => await talkTo(kid)}>👋 {kid} </button>
{/each}
</div>
<h1>Ah, the halls... {score} </h1>
<h1>{$metalRep}</h1>
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
    </div>
    {/if}
<button class="doneButton" on:click={advance}>That's enough talking for one day. Time for lunch...</button>
