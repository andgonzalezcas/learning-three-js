import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

THREE.ColorManagement.enabled = false

const parameters = {
    materialColor: '#ffeded',
    objectsDistance: 4,
    particlesCount: 200
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Lights
const directionalLight = new THREE.DirectionalLight('#fff', 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

// Textures
const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('textures/gradients/3.jpg');
gradientTexture.magFilter = THREE.NearestFilter;

/**
 * Objects
 */

const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
});

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 30), material);
const mesh3 = new THREE.Mesh(new THREE.IcosahedronGeometry(1), material);
const sectionMeshes = [mesh1, mesh2, mesh3];

sectionMeshes.map((mesh, index) => {
    mesh.position.set(2 * Math.pow(-1, index), -parameters.objectsDistance * index, 0);
});

scene.add(mesh1, mesh2, mesh3);

// Particles
const positions = new Float32Array(parameters.particlesCount * 3);

for (let i = 0; i < parameters.particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = parameters.objectsDistance * 0.5 - Math.random() * parameters.objectsDistance * sectionMeshes.length;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
};

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

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
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Scroll
let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    const newSection = Math.round(scrollY / sizes.height);

    if (newSection !== currentSection) {
        currentSection = newSection
        gsap.to(sectionMeshes[currentSection].rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',
            y: '+=3',
            z: '+=1.5'
        })
    }
});

// Cursor
const cursor = { x: 0, y: 0 }

window.addEventListener('mousemove', (event) => {
    cursor.x = -Math.cos(event.clientX / sizes.width * Math.PI);
    cursor.y = -Math.cos(event.clientY / sizes.height * Math.PI);
});

// Debug
const gui = new dat.GUI();

gui.addColor(parameters, 'materialColor').onChange(() => {
    material.color.set(parameters.materialColor);
    particlesMaterial.color.set(parameters.materialColor);
});

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Rotate objects
    sectionMeshes.map((mesh) => {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.15;
    });

    camera.position.set(0, (-scrollY / sizes.height) * parameters.objectsDistance);

    // Animate camera
    const parallax = {
        x: cursor.x * 0.2,
        y: -cursor.y * 0.2
    };

    cameraGroup.position.x += (parallax.x - cameraGroup.position.x) * 4 * deltaTime
    cameraGroup.position.y += (parallax.y - cameraGroup.position.y) * 4 * deltaTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()