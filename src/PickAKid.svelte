<script>
    export let showOverlay;
    import { onMount } from "svelte";
    let json;
    let bgMusic;

    import {kids, goalGroup} from "./store.js";

    onMount(async () => {
		const res = await fetch(`assets/data/kid-intros.json`);
		json = await res.json();
    });

    let selected = "";

    const decide = () => {
        goalGroup.set(selected);
        showOverlay = false;
    }

    const select = kid => {
        selected = kid;
        bgMusic = `./assets/music/${kid}.mp3`;
    }
</script>

<style>
    .container {
        min-width: 100%;
        min-height: 100%;
        background-color: cornflowerblue;
    }

    button:hover {
        box-shadow: 0 0 2px 2px cyan;
    }

    .done {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        height: 3rem;
    }

    .hi {
        font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
        font-size: 48px;
    }
</style>

<div class="container">
    <audio src={bgMusic} autoplay=true loop="true"/>
    <h1>THE COOL KIDS</h1>
    {#each $kids as kid}
        <h2>{kid}</h2>
        <div>
            {#if selected == kid}
                <div class="hi">{json[kid]}</div>
            {/if}
        </div>
        <button on:click={() => select(kid)}>ℹ️</button>
    {/each}
    
    {#if selected}
        <button class="done" on:click={decide}>Maybe the {selected} kids?</button>
    {/if}
</div>