<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';

	const git = 'https://github.com/JollyGrin/deancafe/blob/main/src/routes/debug/decal/Scene.svelte';
</script>

<div class="relative h-full">
	<div class="absolute z-50 m-2 opacity-20">
		<p>Hold Space to drag a sticker</p>
		<p>While hovering over a sticker, use arrow keys to rotate</p>
		<a href={git}> git </a>
	</div>
	<Canvas>
		<Scene />
	</Canvas>
</div>

<style>
	:global(html, body) {
		margin: 0;
		height: 100%;
	}
</style>
