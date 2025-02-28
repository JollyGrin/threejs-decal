<script lang="ts">
	import { page } from '$app/state';
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';

	const git = 'https://github.com/JollyGrin/threejs-decal';
	const { url } = page;
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
	<div class="absolute bottom-4 left-6 z-50 flex">
		<p>
			{url.searchParams}
		</p>
		<select>
			<option>1</option>
			<option>2</option>
		</select>
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
