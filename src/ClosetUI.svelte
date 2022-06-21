<script>
    import {itemsInView} from "./store.js";

    const load = what => {
        itemsInView.set(what);
    }
</script>

<style>
    .buttonCol {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .buttonCol button {
        background-color: transparent;
        height: 140px;
        width: 160px;
    }
    .hair {
        background-image: url("../assets/images/UI/closet-button_hair-up.png");
    }
    .hair:hover {
        background-image: url("../assets/images/UI/closet-button_hair-down.png");
    }
    .feet {
        background-image: url("../assets/images/UI/closet-button_feet-up.png");
    }
    .feet:hover {
        background-image: url("../assets/images/UI/closet-button_feet-down.png");
    }
    .top {
        background-image: url("../assets/images/UI/closet-button_tops-up.png");
    }
    .top:hover {
        background-image: url("../assets/images/UI/closet-button_tops-down.png");
    }
    .bottom {
        background-image: url("../assets/images/UI/closet-button_bottom-up.png");
    }
    .bottom:hover {
        background-image: url("../assets/images/UI/closet-button_bottom-down.png");
    }
</style>
<div class="buttonCol">
    <button class="hair" on:click={() => load("hair")}>&nbsp;</button>
    <button class="top" on:click={() => load("top")}>&nbsp;</button>
    <button class="bottom" on:click={() => load("bottom")}>&nbsp;</button>
    <button class="feet" on:click={() => load("feet")}>&nbsp;</button>
</div>
