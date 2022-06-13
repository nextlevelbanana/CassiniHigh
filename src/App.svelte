<script>
	import ClosetScene from "./ClosetScene.svelte";
	import HallScene from "./HallScene.svelte";
	import {currentScene} from "./store.js";
</script>

<main>
	{#if $currentScene == "closet"}
		<ClosetScene/>
	{:else if $currentScene == "hall"}
		<HallScene/>
	{/if}
</main>

<style>
	main {
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;		
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>