import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const matcapTexture = textureLoader.load('/textures/matcaps/1.png');
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');

const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
]);

// Objects
// const material = new THREE.MeshStandardMaterial({
//     transparent: true,
//     side: THREE.DoubleSide,
//     map: doorColorTexture,
//     alphaMap: doorAlphaTexture,
//     aoMap: doorAmbientOcclusionTexture,
//     aoMapIntensity: 1.2,
//     normalMap: doorNormalTexture,
//     metalnessMap: doorMetalnessTexture,
//     metalness: .2,
//     roughnessMap: doorRoughnessTexture,
//     roughness: .9,
//     displacementMap: doorHeightTexture,
//     displacementScale: .8
// })

// const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
// material.wireframe = true
// material.transparent = true
// material.opacity = 0.5

const material = new THREE.MeshStandardMaterial();
// material.flatShading = true;
material.roughness = .0;
material.metalness = .8;
material.envMap = environmentMapTexture;

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(.5, 32, 32),
    material
);
sphere.position.set(-1.5, 0, 0);
scene.add(sphere);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    material
);
scene.add(plane);

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(.3, .2, 16, 23),
    material
);
torus.position.set(1.5, 0, 0);
scene.add(torus);

// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
//     material
// );
// scene.add(cube);

/**
 * Light
 */

const pointLight = new THREE.PointLight(0xffffff, .8)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    const rotatonX = .1 * elapsedTime;
    const rotatonY = .15 * elapsedTime;

    // sphere.rotation.set(rotatonX, rotatonY, 0);
    // plane.rotation.set(rotatonX, rotatonY, 0);
    // torus.rotation.set(rotatonX, rotatonY, 0);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()