<script>
    import {reps} from "./store.js";

    const completeCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];
    let idx = 0;
    let show = false;

    const checkKonami = ev => {
        if (completeCode[idx] != ev.code) {
            let idx = 0;
        } else {
            if (idx == completeCode.length - 1) {
                show = true;
            } else {
                idx++;
            }
        }
    }
</script>

<style>
    .secret {
        position: absolute;
        z-index: 1000;
        top: 5px;
        left: 5px;
    }
</style>

<svelte:window on:keyup={checkKonami}/>
{#if show} 
<div class="secret">Reps:
   <div>floof: {$reps.floof}</div>
   <div>invisigoth: {$reps.invisigoth}</div>
   <div>morm: {$reps.morm}</div>
   <div>turbo: {$reps.turbo}</div>
</div>
{/if}