<script>
    let show = false;
    const cancel = () => show = false;

    const quit = () => {
        window.close();
    }

    const pause = ev => {
        if (ev.key == "Escape") {
            show = true;
        }
    }
</script>

<style>
    .overlay {
        background-color: #efefef;
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 100;
        border: 2px dashed lime;
        text-align: center;
    }

</style>
<svelte:window on:keyup={pause} />
{#if show}
    <div class="overlay">
        <h1>Quit?</h1>
        <button on:click={quit}>Quit</button>
        <button on:click={cancel}>Resume Game</button>
    </div>
{/if}