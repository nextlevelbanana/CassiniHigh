<script>
import { currentScene } from "./store";

</script>
<h1>Earthcore Kid at Cassini High</h1>
<button on:click={() => currentScene.set("closet")}>play!</button>
<button on:click={() => currentScene.set("credits")}>credits</button>