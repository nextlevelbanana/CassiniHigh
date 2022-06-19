<script>
import { currentScene, currentDay, days, kids, threshholds, reps } from "./store";

    let isStanding = true;
    let currentMood;

    $: if (!isStanding) {
        currentDay.set($currentDay + 1);
        if ($currentDay < 5) {
            currentScene.set("outro");
        } else {
            currentScene.set("closet");
        }
    }

    const sitWith = async (kid) => {
        getCurrentMood(kid);
        askToSit();
        hearResponse();
        recalculateMood();
        ifStandingRemoveFromOptions();
    }

    const getCurrentMood = async (kid) => {
        if ($reps[kid] < threshholds.unsure) {
            currentMood = "dislike";
        } else if ($reps[kid] >= threshholds.like) {
            currentMood = "like";
        } else {
            currentMood = "unsure";
        }
    }

    const eatAlone = () => {
        displayInternalMonologue();
        moveOn();
    }
</script>

<h1>LUNCH TIME</h1>
{#each $kids as kid}
<button on:click={async () => await sitWith(kid)}>Sit with {kid}</button>
{/each}
<button on:click={eatAlone}>Eat Alone</button>