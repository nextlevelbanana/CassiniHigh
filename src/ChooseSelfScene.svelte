<script>
    import {name, currentScene} from "./store.js";
</script>

<style>
    input {
        font-size: 48px;
    }
    .container {
        margin: 1rem auto;
        text-align: center;
    }
    h1 {
        font-size: 48px;
    }
</style>

<div class="container">
    <h1>What's your name?</h1>
    <input bind:value={$name}/>
    <div>
    <button on:click={() => currentScene.set("intro")}>Yep, that's me. {$name}.</button>
    </div>
</div>