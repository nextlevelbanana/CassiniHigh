<script>
	import ClosetScene from "./ClosetScene.svelte";
	import HallScene from "./HallScene.svelte";
	import LunchScene from "./LunchScene.svelte";
	import TitleScene from "./TitleScene.svelte";
	import {currentScene} from "./store.js";
	import PauseMenu from "./PauseMenu.svelte";
	import IntroScene from "./IntroScene.svelte";
	import ChooseSelfScene from "./ChooseSelfScene.svelte";
	import OutroScene from "./OutroScene.svelte";
	import CreditsScene from "./CreditsScene.svelte";
	import KonamiCode from "./KonamiCode.svelte";
	import CurrentDay from "./CurrentDay.svelte";


	console.log("Hey! No cheating!");

	let bgImg;
	let cssVarStyles = `--bgImg: url('${bgImg}')`	;
	$: {
		bgImg = `../assets/images/${$currentScene}_background.png`;
		cssVarStyles = `--bgImg: url(${bgImg})`;
	}
</script>

<main style="{cssVarStyles}">
	{#if $currentScene == "title"}
		<TitleScene/>
	{:else if $currentScene == "name"}
		<ChooseSelfScene/>
	{:else if $currentScene == "intro"}
		<IntroScene/>
	{:else if $currentScene == "closet"}
		<ClosetScene/>
	{:else if $currentScene == "hall"}
		<HallScene/>
	{:else if $currentScene == "lunch"}
		<LunchScene/>
	{:else if $currentScene == "outro"}
		<OutroScene/>
	{:else if $currentScene == "credits"}
		<CreditsScene/>
	{/if}
	{#if $currentScene != "credits"}
	<CurrentDay/>
	{/if}
	<PauseMenu/>
	<KonamiCode/>
</main>

<style>
	main {
		padding: 1rem;
		background-image: var(--bgImg);
		height:100vh;
		width: 100vw;
		background-repeat: no-repeat;
		background-position: center;
	}
</style>