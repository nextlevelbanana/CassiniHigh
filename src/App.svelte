<script>
	import ClosetScene from "./ClosetScene.svelte";
	import HallScene from "./HallScene.svelte";
	import LunchScene from "./LunchScene.svelte";
	import TitleScene from "./TitleScene.svelte";
	import {currentScene} from "./store.js";
	import PauseMenu from "./PauseMenu.svelte";
	console.log("Hey! No cheating!");
</script>

<main>
	{#if $currentScene == "title"}
		<TitleScene/>
	{:else if $currentScene == "closet"}
		<ClosetScene/>
	{:else if $currentScene == "hall"}
		<HallScene/>
	{:else if $currentScene == "lunch"}
		<LunchScene/>
	{/if}
	<PauseMenu/>
</main>

<style>
	main {
		margin: 1rem;
	}
</style>