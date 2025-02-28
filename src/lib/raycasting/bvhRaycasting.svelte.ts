import { injectPlugin, isInstanceOf } from '@threlte/core';
import {
	computeBoundsTree,
	disposeBoundsTree,
	acceleratedRaycast
} from 'three-mesh-bvh';

export const bvhRaycasting = () => {
	injectPlugin('bvh-raycast', (args) => {
		$effect(() => {
			if (isInstanceOf(args.ref, 'BufferGeometry')) {
				args.ref.computeBoundsTree = computeBoundsTree;
				args.ref.disposeBoundsTree = disposeBoundsTree;
				args.ref.computeBoundsTree();
			}
			if (isInstanceOf(args.ref, 'Mesh')) {
				args.ref.raycast = acceleratedRaycast;
			}
			return () => {
				if (isInstanceOf(args.ref, 'BufferGeometry')) {
					args.ref.disposeBoundsTree();
				}
			};
		});
	});
};
