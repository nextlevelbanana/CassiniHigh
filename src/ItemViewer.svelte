<script>
    import {itemsInView, hair, top, bottom, feet} from "./store.js";
    import { createEventDispatcher } from 'svelte';

    const items=[1,2,3,4,5,6];

    const putOn = i => {
        eval($itemsInView).set(i);
    }

</script>
<style>
    .box {
        border: 1px dashed cyan;
        height: 800px;
        width: 1000px;
        position: absolute;
        top: 50px;
        left: 600px;
        overflow-x: auto;
        display: flex;
    }
    img {
        display: inline-block;
        max-width: 66%;
        max-height: 80%;
    }
</style>
<div class="box">
    {#each items as i}
        <img on:click={() => {putOn(i)}} src={`assets/images/Closet/${$itemsInView}/${i}.png`}/>
    {/each}

</div>