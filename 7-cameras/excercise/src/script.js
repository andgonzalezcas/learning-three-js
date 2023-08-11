import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
  width: 800,
  height: 600
}

// Scene
const scene = new THREE.Scene()

/** 
 * Group
 */
const group = new THREE.Group();
scene.add(group);

/**
 * Objects
 */
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
cube1.position.set(1.5, 0, 0)
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ffff })
);

group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff00ff })
);

group.add(cube3);
cube3.position.set(-1.5, 0, 0)

// Camera
const ASPECT_RATIO = sizes.width / sizes.height
const camera = new THREE.PerspectiveCamera(75, ASPECT_RATIO, 0.1, 100)
// const camera = new THREE.OrthographicCamera(-1 * ASPECT_RATIO, 1 * ASPECT_RATIO, 1, -1)
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(cube2.position)
scene.add(camera)

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

// Cursor
const cursor = {
  x: 0,
  y: 0
};

canvas.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = -(event.clientY / sizes.height - 0.5)
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // mesh.rotation.y = elapsedTime;

  // Update camera
  // camera.position.set(Math.sin(cursor.x * Math.PI * 2) * 5, cursor.y * 20, Math.cos(cursor.x * Math.PI * 2) * 3);
  // camera.lookAt(cube2.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
}

tick()