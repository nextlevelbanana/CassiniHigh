<script>
    import Player from "./Player.svelte";
    import {sleep} from "./sleep.js";
    import {getItemName} from "./helpers.js";
    import {name, kids, currentScene, hair, top, bottom, feet, reps, threshholds, counts, howTheyFeelAbout} from "./store.js";
    //copypasta
    let showArrow = "";
    let localKids = ["turbo", "floof", "morm", "invisigoth"]
    let talking;
    let canTalk = {floof: true, invisigoth: true, morm: true, turbo: true};
    //end copypasta

    const formatString = (str,item) => {
        let res = str.replaceAll("$name", $name)
        if (item) {
            res = res.replaceAll("$item", getItemName(item, eval("$" + item)));
        }
        return res;
    }

    let bgMusic = null;

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

    const startingReps = {...$reps};

    let score = 0;
    let showYou = false;
    
    let them = [];
    let them2 = [];
    let you = [];

    let currentKid;
    let weights;
    let showDoneWithKidButton;

    const advance = () => {
        currentScene.set("lunch");
    }

    const talkTo = async (kid) => {
        bgMusic = `./assets/music/${kid}.wav`;
        them = [];
        them2 = [];
        currentKid = kid;
        showArrow = ""; 
        talking = kid;
        await sleep(2400);
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
        them = [formatString(json.opener)];
        await sleep(2400);
        you = [{rank: "good", value: formatString(json.good)}, {rank: "bad", value: formatString(json.bad)}, {rank: "what", value: formatString(json.what)}].sort(shuffle );
        showYou = true;
    }       

    const talk = async rank => {
        you = [you.find(opt => opt.rank == rank)];
        await sleep(2400);

        them2 = [json["on" + rank]];
        calculateNewRep(rank);
        await sleep(3000);
        giveTip();
        showDoneWithKidButton = true;
    }

    const giveTip = () => {
        if (min.score < 0.45) {
            them2 = [...them2, formatString(json.badTip, (min.key))];
        } else if (max.score > 0.75) {
            them2 = [... them2, formatString(json.goodTip, max.key)];
        }
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

    }

    const shuffle = () => Math.random() - 0.5;
    const clearKid = () => {
        score = 0;
        you = [];
        them = [];
        canTalk[currentKid] = false;
        bgMusic = null;
        calculateNewRepsForOthers(currentKid);
        // localKids = localKids.filter(k => k != currentKid);
        currentKid = null;
        talking = null;
        showArrow = null;
        showDoneWithKidButton = false;
        
    }

    const calculateNewRepsForOthers = currentKid => {
        const oldRep = startingReps[currentKid];
        const newRep = $reps[currentKid];
        let modifier = 1;
        if (newRep < oldRep) {
            modifier = -1;
        }

        for (const otherGroup of Object.keys($howTheyFeelAbout)) {
            
            if (otherGroup == currentKid) {
                continue;
            } else {
                $reps[otherGroup] += $howTheyFeelAbout[otherGroup][currentKid] * modifier;
            }
        }
    }

</script>

<style>
    h1 {
        margin-top: 0;
    }
    .playerContainer {
        position: absolute;
        top: -50px;
        left: 50px;
        display: inline-flex;
        transform: scale(0.8);
    }

    .doneButton {
        border: 1px solid cyan;
        position: absolute;
        bottom: 10px;
        right: 10px;
    }

    .buttons {
        display: inline-flex;
        height: 100%;
        /* padding-left: 250px;
        margin-top: 100px; */
    }

    .tableContainer {
       height: 800px;
       overflow-x: auto;
       overflow-y: hidden;
       border: 1px dashed cyan;
       background-image: url("../assets/images/hall_inner_background.png");
        background-attachment: local;
        background-position: left top;
        background-repeat: no-repeat;
        left: 500px;
        width: 1500px;
        position: absolute;
        top: 50px;
        overflow-x: auto;
        /* display: flex; */
    }

    .buttons button {
        z-index: 1;
        width: 900px;
        border: 0;
        background-color: transparent;
        height: 100%;
        vertical-align: bottom;

    }

    .kids {
        max-width: 100%;
        max-height: calc(100% - 100px);
        vertical-align: bottom;
    }

    .them {
        /* position: absolute;
        left: 1300px;
        top: 100px; */
        /* width: 150%; */
        font-size: 36px;
        /* min-width: 600px;
        max-width: 600px; */
    }
    .them .line {
        border-radius: 10%;
        background-color: aqua;
        padding: 2rem;
        margin: 1rem;
    }

    .you {
        font-size: 36px;
        display: block;
        text-align: center;
    }

    .you button {
        background-color: aquamarine;
        border-radius: 10%;
        padding: 2rem;
        position: relative;

    }
    .you button:hover {
        background-color: lightgreen;
    }

    .convo {
        position:absolute;
        left: 400px;
        top: 60px;
        width: 1000px;
        display: block;
        height: 800px;
        text-align: center;
        z-index: 5;
    }

    .arrow {
        height: 100px;
        min-height: 100px;
        display: block;
        margin: 0px auto;
    }

</style>
{#if bgMusic}
    <audio src={bgMusic} autoplay=true loop="true"/>
{/if}


<h1>Ok. Chillin before class. The perfect time to make friends. You can do this...</h1>
<div class="playerContainer">
    <Player></Player>
</div>
<div class="tableContainer">
    <div class="buttons">
        {#each localKids as kid}
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <button on:mouseover={() => showArrow = kid} on:click|once={async () =>  await talkTo(kid)}>
                <img class="arrow" src={showArrow == kid && canTalk[kid] && !talking ? "assets/images/lunch/lunch_talk.png" : "assets/images/empty.png"}/>
            <img class="kids" src={`./assets/images/groups/${kid}.png`}/>
        </button>
        {/each}
    </div>
</div>

{#if talking}
<div class="convo">
    <div class="them">
        {#each them as line}
        <div class="line">{line}</div>
        {/each}
    </div>
    {#if showYou}
        <div class="you">
            {#each you as option}
                <button on:click={async () => await talk(option.rank)}>{option.value}</button>
            {/each}
        </div>
    {/if}
    <div class="them">
        {#each them2 as line}
        <div class="line">{line}</div>
        {/each}
    </div>
    {#if showDoneWithKidButton}
    <div class="you">
        <button class="doneButton" on:click={clearKid}>...bye...</button>
    </div>
    {/if}
</div>
{/if}


{#if !currentKid}
    <button class="doneButton" on:click={advance}>That's enough talking for one day. Time for lunch...</button>
{/if}
