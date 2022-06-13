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
        top: 30px;
        left: 100px;
        display: inline-flex;
    }

    .doneButton {
        border: 1px solid lime;
        position: absolute;
        bottom: 10px;
        right: 10px;
    }
</style>

<!-- <h1>Let's get dressed!</h1> -->

<div class="playerContainer">
    <Player/>
    <ClosetUI/>
    <ItemViewer/>
</div>
<button class="doneButton" on:click={advance}>I'm as ready as I'm gonna get...</button>
