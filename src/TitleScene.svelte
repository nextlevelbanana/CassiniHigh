<script>
import { currentScene } from "./store";

</script>

<style>
    .container {
        margin: 1rem auto;
        text-align: center;
    }
    h1 {
        font-size: 144px;
    }
</style>
<div class="container">
    <h1>Fitting in at Cassini High</h1>
    <div>
    <button on:click={() => currentScene.set("name")}>play!</button>
    </div>
    <button on:click={() => currentScene.set("credits")}>credits</button>
    <audio src="./assets/music/closet.wav" autoplay=true loop="true"/>

</div>