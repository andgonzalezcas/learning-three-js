import * as THREE from 'three';
import gsap from 'gsap';

// Variables
const ONE_REVOLUTION = Math.PI * 2;

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Sizes
const sizes = {
    width: 800,
    height: 600
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// Clock
const clock = new THREE.Clock();

// Animaitons
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: -2 });
gsap.to(mesh.position, { duration: 1, delay: 3, x: 0 });

const tick = () => {
    /* // Time
    const elapseTime = clock.getElapsedTime();

    // Update objects
    camera.position.x = Math.sin(elapseTime * ONE_REVOLUTION);
    camera.position.y = Math.cos(elapseTime * ONE_REVOLUTION);
    camera.lookAt(mesh.position) */

    //render
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();