<script>
    import {name, currentScene} from "./store.js";
</script>

<h1>What's your name?</h1>
<input bind:value={$name}/>

<button on:click={() => currentScene.set("intro")}>Yep, that's me. {$name}.</button>