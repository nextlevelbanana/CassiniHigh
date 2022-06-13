<script>
    import {itemsInView} from "./store.js";

    const load = what => {
        itemsInView.set(what);
    }
</script>

<style>
    button:hover {
        box-shadow: 0 0 0 4px cyan;
    }
    .buttonCol {
        display: flex;
        flex-direction: column;
    }
</style>
<div class="buttonCol">
    <button on:click={() => load("hair")}><img src="assets/images/UI/closet-button_hair.png"/></button>
    <button on:click={() => load("top")}><img src="assets/images/UI/closet-button_top.png"/></button>
    <button on:click={() => load("bottom")}><img src="assets/images/UI/closet-button_bottom.png"/></button>
    <button on:click={() => load("feet")}><img src="assets/images/UI/closet-button_feet.png"/></button>
</div>
