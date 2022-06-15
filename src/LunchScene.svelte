<script>
import { currentScene, currentDay, days, kids, threshholds, reps } from "./store";

    let isStanding = true;

    $: if (!isStanding) {
        currentDay.set($currentDay + 1);
        if ($currentDay < 5) {
            currentScene.set("outro");
        } else {
            currentScene.set("closet");
        }
    }

    const sitWith = async (kid) => {
        getCurrentMood();
        askToSit();
        hearResponse();
        recalculateMood();
        ifStandingRemoveFromOptions();
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