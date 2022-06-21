<script>
    import ClosetUI from "./ClosetUI.svelte";
    import ItemViewer from "./ItemViewer.svelte";
    import Player from "./Player.svelte";
    import {currentScene} from "./store.js";

    const advance = () => {
        currentScene.set("hall");
    }
</script>

<style>
    .playerContainer {
        position: absolute;
        top: -10px;
        left: 80px;
        display: inline-flex;
    }

    .doneButton {
        border: 1px solid lime;
        position: absolute;
        bottom: 10px;
        right: 10px;
    }
    .container-container {
        transform: scale(0.9);
    }
</style>
<h1>What should I wear...?</h1>
<div class="playerContainer">
    <div class="container-container">
    <Player/>
    </div>
    <ClosetUI/>
    <ItemViewer/>
</div>
<button class="doneButton" on:click={advance}>I'm as ready as I'm gonna get...</button>
