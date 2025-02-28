<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { OrbitControls, useGltf, useTexture, interactivity, HUD } from '@threlte/extras';
	import * as THREE from 'three';
	import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
	import { DEG2RAD } from 'three/src/math/MathUtils.js';
	import { DecalMaterial } from '$lib/shaders/decalMaterial';
	import HudScene from './HUDScene.svelte';

	type Event = THREE.Intersection & {
		intersections: THREE.Intersection[]; // The first intersection of each intersected object
		object: THREE.Object3D; // The object that was actually hit
		eventObject: THREE.Object3D; // The object that registered the event
		camera: THREE.Camera; // The camera used for raycasting
		delta: THREE.Vector2; //  Distance between mouse down and mouse up event in pixels
		nativeEvent: MouseEvent | PointerEvent | WheelEvent; // The native browser event
		pointer: THREE.Vector2; // The pointer position in normalized device coordinates
		ray: THREE.Ray; // The ray used for raycasting
		stopPropagation: () => void; // Function to stop propagation of the event
		stopped: boolean; // Whether the event propagation has been stopped
	};

	const { camera } = useThrelte();

	let intersectionPoint: THREE.Vector3 | null = $state(null);

	// add interactivity
	interactivity({
		compute: (event, state) => {
			// Update the pointer

			if (!bunnyMesh) return;
			const intersects = state.raycaster.intersectObject(bunnyMesh);
			const [intersection] = intersects;
			intersectionPoint = intersection?.point ?? null;

			state.pointer.update((p) => {
				p.x = (event.clientX / window.innerWidth) * 2 - 1;
				p.y = -(event.clientY / window.innerHeight) * 2 + 1;
				return p;
			});
			// Update the raycaster
			state.raycaster.setFromCamera(state.pointer.current, $camera);
		}
	});

	// Load the bunny model using useGltf
	const gltfPromise = useGltf(
		'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bunny/model.gltf'
	);

	// Load textures for stickers using useTexture
	const stickerUrls = {
		sticker1: '/Sticjer_1024x1024@2x.png',
		sticker2: '/Twemoji_1f600.svg.png',
		sticker3: '/D64aIWkXoAAFI08.png',
		sticker4: '/three.png'
	};

	const texturesPromise = useTexture(stickerUrls);

	// Debug state
	let debug = false;

	// Hover state using $state
	let hoveredSticker: string | null = $state(null);
	let isDragging: boolean = $state(false);
	let draggedSticker: string | null = $state(null);
	let selectedTexture: THREE.Texture | null = $state(null);

	// Sticker positions and configurations
	const stickerConfigs = $state([
		{
			id: 'sticker_heart',
			position: [0.37119736622026034, -0.014923112415556439, 0.6328978861512411],
			rotation: [0, 0, 0],
			scale: [0.35, 0.35, 1]
		},
		{
			id: 'sticker_smile',
			position: [0.004341807832027644, 0.3585630991995048, 0.2383905658327521],
			rotation: [1, 0, 0],
			scale: [0.3, 0.3, 1]
		},
		{
			id: 'sticker_nasa',
			position: [-0.33548826510530505, 0.029074589004543405, 0.6578025135968337],
			rotation: [0, 0, 0],
			scale: [0.45, 0.45, 1]
		},
		{
			id: 'sticker_four',
			position: [-0.9987768252849216, 0.5757206970809765, 0.7284706017893905],
			rotation: [0, 1, 0],
			scale: [0.3, 0.3, 1]
		}
	]);

	// HACK: updates the matrix so that the stickers render after the bunny position changes position
	let matrixVersion = $state(0);
	const { start, stop } = useTask(() => {
		if (matrixVersion > 5) return;
		if (bunnyMesh) {
			bunnyMesh.updateMatrixWorld();
			matrixVersion++;
		}
	});

	// Update sticker position when dragging
	$effect(() => {
		if (!!draggedSticker && intersectionPoint) {
			stop(); // HACK: stop updating matrix
			const sticker = stickerConfigs.find((s) => s.id === draggedSticker);
			if (sticker) {
				sticker.position = [intersectionPoint.x, intersectionPoint.y, intersectionPoint.z];
			}
		}
	});

	let bunnyMesh: THREE.Mesh | undefined = $state();

	const quaternion = new THREE.Quaternion();
	useTask(() => quaternion.copy(camera.current.quaternion).invert(), { autoInvalidate: false });

	// Keyboard state
	let isSpacePressed = $state(false);

	// Handle keyboard events
	function handleKeyDown(event: KeyboardEvent) {
		if (event.code.includes('Arrow') || ['Comma', 'Period'].includes(event.code)) {
			const isLeft = event.code === 'ArrowLeft';
			const isRight = event.code === 'ArrowRight';
			const isUp = event.code === 'ArrowUp';
			const isDown = event.code === 'ArrowDown';
			const isZ = event.code === 'Comma';
			const isZNeg = event.code === 'Period';

			const z = isLeft ? -0.1 : isRight ? 0.1 : 0;
			const x = isUp ? -0.1 : isDown ? 0.1 : 0;
			const y = isZ ? -0.1 : isZNeg ? 0.1 : 0;

			const sticker = stickerConfigs.find((s) => s.id === hoveredSticker);
			if (sticker) {
				sticker.rotation = [
					sticker.rotation[0] + x,
					sticker.rotation[1] + y,
					sticker.rotation[2] + z
				];
			}
		}

		if (event.code !== 'Space') return;
		if (!!draggedSticker) return;
		event.preventDefault(); // Prevent page scroll
		isSpacePressed = true;
		isDragging = true;
		draggedSticker = hoveredSticker;
	}

	function handleKeyUp(event: KeyboardEvent) {
		if (event.code !== 'Space') return;

		console.log(
			'new sticker',
			stickerConfigs.find((s) => s.id === draggedSticker)
		);

		isSpacePressed = false;
		isDragging = false;
		draggedSticker = null;
	}
</script>

<svelte:window on:keydown|preventDefault={handleKeyDown} on:keyup|preventDefault={handleKeyUp} />

{#await Promise.all([gltfPromise, texturesPromise]) then [gltf, textures]}
	<HUD>
		<HudScene texture={selectedTexture} {quaternion} />
	</HUD>

	<T.PerspectiveCamera position={[2, 2, 10]} fov={20} makeDefault {camera}>
		<OrbitControls
			maxPolarAngle={DEG2RAD * 90}
			enableRotate={!isDragging}
			enableDamping
			enablePan={true}
		/>
	</T.PerspectiveCamera>

	<T.Scene>
		{@render lightsEnvironment()} // lights
		{@render lightsGroupShadow()}
		{@render floor()} // ground for lighting
		{@render intersectionDot()} // raycasting dot

		<T.Mesh
			bind:ref={bunnyMesh}
			castShadow
			receiveShadow
			geometry={gltf.nodes.bunny.geometry}
			position={[0, -1, 0]}
		>
			<T.MeshStandardMaterial color="white" roughness={0.6} metalness={0.8} envMapIntensity={1.2} />
		</T.Mesh>

		{#each Object.entries(textures) as [key, texture], i}
			{@const sticker = stickerConfigs[i]}
			{#if i < stickerConfigs.length && bunnyMesh && matrixVersion}
				<T.Mesh
					geometry={new DecalGeometry(
						bunnyMesh,
						new THREE.Vector3(...sticker.position),
						new THREE.Euler(...sticker.rotation),
						new THREE.Vector3(...sticker.scale)
					)}
					interactive
					onpointerover={() => {
						hoveredSticker = sticker.id;
						selectedTexture = texture;
					}}
					onpointerout={() => {
						hoveredSticker = null;
						selectedTexture = null;
					}}
				>
					{#if sticker.id === hoveredSticker}
						{@render hoverSticker(texture)}
					{:else}
						{@render realSticker(texture)}
					{/if}
				</T.Mesh>
			{/if}
		{/each}
	</T.Scene>
{/await}

{#snippet intersectionDot()}
	{#if !!intersectionPoint}
		<T.Mesh position={[intersectionPoint.x, intersectionPoint.y, intersectionPoint.z]}>
			<T.SphereGeometry args={[0.02, 32, 16]} />
			<T.MeshBasicMaterial color="#ff0000" depthTest={false} />
		</T.Mesh>
	{/if}
{/snippet}

{#snippet realSticker(texture: THREE.Texture)}
	<T.MeshPhysicalMaterial
		map={texture}
		transparent
		depthTest={true}
		depthWrite={false}
		polygonOffset={true}
		polygonOffsetFactor={-4}
		wireframe={debug}
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
{/snippet}

{#snippet hoverSticker(texture: THREE.Texture)}
	<T is={DecalMaterial} map={texture} outlineColor="gold" outlineWidth={10} alphaThreshold={0.5} />
{/snippet}

{#snippet lightsEnvironment()}
	<T.AmbientLight intensity={7} />
	<T.SpotLight
		position={[4, 8, 4]}
		intensity={1.5}
		angle={0.4}
		penumbra={0.8}
		decay={1.5}
		distance={20}
		castShadow
	/>
	<T.SpotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
	<T.DirectionalLight position={[-4, 2, -4]} intensity={0.3} color="#b6ceff" />
	<T.DirectionalLight position={[0, -2, -6]} intensity={0.2} color="#ffd0d0" />

	<T.AmbientLight intensity={0.5} />
	<T.DirectionalLight position={[5, 5, 5]} intensity={0.5} />
{/snippet}

{#snippet lightsGroupShadow()}
	<T.Group position={[0, 0.04, 0]}>
		<T.DirectionalLight castShadow position={[2.5, 5, -5]} intensity={0.5} shadow-bias={0.001} />
	</T.Group>
{/snippet}

{#snippet floor(y: number = -1.01)}
	<T.Mesh rotation.x={-Math.PI / 2} position.y={y} receiveShadow>
		<T.PlaneGeometry args={[20, 20]} />
		<T.ShadowMaterial opacity={0.2} />
	</T.Mesh>
{/snippet}
