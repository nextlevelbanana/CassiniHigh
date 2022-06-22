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
        bgMusic = `./assets/music/${kid}.wav`;
    }
</script>

<style>
    .container {
        min-width: 100%;
        min-height: 100%;
        background-color: cornflowerblue;
        background-image: url("../assets/images/title_background.png");
    }

    button:hover {
        box-shadow: 0 0 2px 2px cyan;
    }

    button:not(.done) {
        background-color: transparent;
        width: 470px;
        border: none;
    }

    button img {
        max-width: 100%;
    }

    .done {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        width: unset;
    }

    .hi {
        font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
        font-size: 48px;
    }
    .scrolly {
        overflow-x: auto;
        height: 800px;
        display: inline-flex;
    }
</style>

<div class="container">
    <audio src={bgMusic} autoplay=true loop="true"/>
    <h1>THE COOL KIDS</h1>
    <div class="scrolly">
    {#each $kids as kid}
        <button on:click={() => select(kid)}>
            <div>
                {#if selected == kid}
                    <div class="hi">{json[kid]}</div>
                {/if}
            </div>
            <h2>{kid}</h2>
            <img src={`./assets/images/groups/${kid}.png`}/>
        </button>
    {/each}
    </div>
    
    {#if selected}
        <button class="done" on:click={decide}>Maybe the {selected} kids?</button>
    {/if}
</div>