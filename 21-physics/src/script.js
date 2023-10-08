import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon'

THREE.ColorManagement.enabled = false

/**
 * Debug
 */
const gui = new dat.GUI();
const debugObject = {};

debugObject.createSphere = () => {
    createSphere(
        Math.random() / 2,
        {
            x: (Math.random() - 0.5) * 3,
            y: Math.random() * 3,
            z: (Math.random() - 0.5) * 3
        }
    );
};

debugObject.createBox = () => {
    createBoxes({
        x: Math.random(),
        y: Math.random(),
        z: Math.random()
    }, {
        x: (Math.random() - 0.5) * 3,
        y: Math.random() * 3,
        z: (Math.random() - 0.5) * 3
    })
}

debugObject.reset = () => {
    objectsToUpdate.map(object => {
        // remove body
        object.body.removeEventListener('collide', playHitSound);
        world.removeBody(object.body);

        // remove mesh
        scene.remove(object.mesh);
    })
}

gui.add(debugObject, 'createSphere');
gui.add(debugObject, 'createBox');
gui.add(debugObject, 'reset');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Sounds
const hitSound = new Audio('/sounds/hit.mp3');
const hitGameSound = new Audio('/sounds/game_hit.wav');
const hitElectroSound = new Audio('/sounds/electro_hit.wav');

const sounds = [hitSound, hitGameSound, hitElectroSound];

function random() {
    let number = Math.floor(Math.random() * sounds.length);
    return number
}

const playHitSound = (collisionEvent) => {
    const impactStrength = collisionEvent.contact.getImpactVelocityAlongNormal();
    const currentSound = sounds[random()];

    if (impactStrength > 1.5) {
        currentSound.volume = Math.random();
        currentSound.currentTime = 0;
        currentSound.play();
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/** 
 * Phisics
 */
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;

// Materials
// const concreteMaterial = new CANNON.Material('concrete');
// const plasticMaterial = new CANNON.Material('plastic');

// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//     concreteMaterial,
//     plasticMaterial,
//     { friction: 0.1, restitution: 0.7 }
// );
// world.addContactMaterial(concretePlasticContactMaterial);

const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    { friction: 0.1, restitution: 0.7 }
);
world.addContactMaterial(defaultContactMaterial);

// const sphereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 3, 0),
//     shape: sphereShape,
//     material: defaultMaterial
// });
// sphereBody.applyLocalForce(new CANNON.Vec3(10, 0, 0), new CANNON.Vec3(0, 0, 0));
// world.addBody(sphereBody);

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({ mass: 0, material: defaultMaterial });
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);

world.addBody(floorBody);

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/** 
 * Utils
 */
const objectsToUpdate = [];

const boxBufferGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
const sphereBufferGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
const meshStandardMaterial = new THREE.MeshStandardMaterial({ metalness: 0.3, roughness: 0.4, envMap: environmentMapTexture });

const createSphere = (radius, position) => {
    // THREE JS MESH
    const mesh = new THREE.Mesh(sphereBufferGeometry, meshStandardMaterial);
    mesh.scale.set(radius, radius, radius);

    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    // CANNON BODY
    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({ mass: 1, position: new CANNON.Vec3(0, 0, 0), shape, material: defaultMaterial });
    body.position.copy(position);
    body.addEventListener('collide', playHitSound);
    world.addBody(body);

    // Save in objects to update
    objectsToUpdate.push({ mesh, body });
}

const createBoxes = (dimensions, position) => {
    // THREE JS MESH
    const mesh = new THREE.Mesh(boxBufferGeometry, meshStandardMaterial);
    mesh.scale.copy(dimensions);

    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    // CANNON BODY
    const shape = new CANNON.Box(new CANNON.Vec3(dimensions.x / 2, dimensions.y / 2, dimensions.z / 2));
    const body = new CANNON.Body({ mass: 1, position: new CANNON.Vec3(0, 0, 0), shape, material: defaultMaterial });
    body.position.copy(position);
    body.addEventListener('collide', playHitSound);

    world.addBody(body);

    // Save in objects to update
    objectsToUpdate.push({ mesh, body });
}
/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapseTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapseTime;
    oldElapseTime = elapsedTime;

    // Update phyisics world
    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);
    world.step(1 / 60, deltaTime, 3); // 60 frames per second
    objectsToUpdate.map(object => {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion);
    })
    // sphere.position.copy(sphereBody.position)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()