<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';
	import { useViewport } from '@threlte/extras';

	let {
		texture,
		quaternion
	}: { texture: THREE.Texture | null; quaternion: THREE.Quaternion | null } = $props();

	const viewport = useViewport();
	const viewportPosition = $derived([$viewport.width / 2 - 1, $viewport.height / 2 - 1, 0]);

	let mesh: THREE.Mesh | undefined = $state(undefined);

	useTask(
		() => {
			if (!mesh || !quaternion) return;
			mesh.quaternion.copy(quaternion);
		},
		{ autoInvalidate: false }
	);
</script>

<T.OrthographicCamera makeDefault zoom={80} position={[0, 0, 10]} />
<T.AmbientLight intensity={Math.PI / 2} />
<T.PointLight position={[10, 10, 10]} decay={0} intensity={Math.PI * 2} />

<T.Mesh position={viewportPosition as [number, number, number]} scale={1} bind:ref={mesh}>
	<T.PlaneGeometry args={[1, 1]} />
	{#if texture}
		<T.MeshPhysicalMaterial
			map={texture}
			transparent
			depthTest={true}
			depthWrite={false}
			polygonOffset={true}
			polygonOffsetFactor={-4}
			iridescence={1}
			iridescenceIOR={2.2}
			iridescenceThicknessRange={[100, 400]}
			roughness={0.2}
			metalness={0.8}
			clearcoat={1}
			clearcoatRoughness={0.1}
			toneMapped={false}
			envMapIntensity={2}
		/>
	{:else}
		<T.MeshToonMaterial color="red" />
	{/if}
</T.Mesh>
