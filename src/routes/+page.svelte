<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';

	const git = 'https://github.com/JollyGrin/threejs-decal';
</script>

<div class="relative h-full">
	<div class="absolute z-50 m-2 text-xs opacity-20">
		<a href={git} class="underline"> Made with Threlte (threejs + svelte) - git </a>
		<p>Hold Space to drag a sticker</p>
		<p>While hovering over sticker, rotate using the keyboard keys:</p>
		<p>
			<span class="key">{'←'}</span>
			<span class="key">{'↑'}</span>
			<span class="key">{'→'}</span>
			<span class="key">{'↓'}</span>
			<span class="key">{','}</span>
			<span class="key">{'.'}</span>
		</p>
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
