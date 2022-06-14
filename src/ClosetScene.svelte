<script>
    import ClosetUI from "./ClosetUI.svelte";
import CurrentDay from "./CurrentDay.svelte";
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

<div class="playerContainer">
    <Player/>
    <ClosetUI/>
    <ItemViewer/>
</div>
<CurrentDay/>
<button class="doneButton" on:click={advance}>I'm as ready as I'm gonna get...</button>
