import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(5))

//fog
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const wallColor = textureLoader.load('./textures/bricks/color.jpg')
const wallNormal = textureLoader.load('./textures/bricks/normal.jpg')
const wallao = textureLoader.load('./textures/bricks/ambientOcclusion.jpg')
const wallRoughness = textureLoader.load('./textures/bricks/roughness.jpg')

const doorColor = textureLoader.load('./textures/door/color.jpg')
const doorAlpha = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusion = textureLoader.load(
	'./textures/door/ambientOcclusion.jpg',
)
const doorHeight = textureLoader.load('./textures/door/height.jpg')
const doorMetalness = textureLoader.load('./textures/door/metalNess.jpg')
const doorNormal = textureLoader.load('./textures/door/normal.jpg')
const doorRoughness = textureLoader.load('./textures/door/roughness.jpg')

const grassColor = textureLoader.load('./textures/grass/color.jpg')
const grassAO = textureLoader.load('./textures/grass/ambientOcclusion.jpg')
const grassNormal = textureLoader.load('./textures/grass/normal.jpg')
const grassRoughness = textureLoader.load('./textures/grass/roughness.jpg')

const stoneColor = textureLoader.load('./textures/stone/stoneColor.jpg')
const stoneHeight = textureLoader.load('./textures/stone/stoneHeight.jpg')
const stoneao = textureLoader.load('./textures/stone/stoneao.jpg')
const stoneNormal = textureLoader.load('./textures/stone/stoneNormal.jpg')
const stoneRoughness = textureLoader.load('./textures/stone/stoneRoughness.jpg')

grassColor.repeat.set(8, 8)
grassAO.repeat.set(8, 8)
grassNormal.repeat.set(8, 8)
grassRoughness.repeat.set(8, 8)

grassColor.wrapS = THREE.RepeatWrapping
grassAO.wrapS = THREE.RepeatWrapping
grassNormal.wrapS = THREE.RepeatWrapping
grassRoughness.wrapS = THREE.RepeatWrapping

grassColor.wrapT = THREE.RepeatWrapping
grassAO.wrapT = THREE.RepeatWrapping
grassNormal.wrapT = THREE.RepeatWrapping
grassRoughness.wrapT = THREE.RepeatWrapping

/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

//wall
const walls = new THREE.Mesh(
	new THREE.BoxGeometry(4, 2.5, 4),
	new THREE.MeshStandardMaterial({
		map: wallColor,
		aoMap: wallao,
		normalMap: wallNormal,
		roughness: wallRoughness,
	}),
)
walls.position.y = 2.5 / 2
walls.material.roughness = 0.5

house.add(walls)

//roof
const roof = new THREE.Mesh(
	new THREE.ConeGeometry(3.5, 1, 4),
	new THREE.MeshStandardMaterial({ color: '#b35f45' }),
)
roof.position.y = 3
roof.rotation.y = Math.PI * 0.25
house.add(roof)

//door
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
	new THREE.MeshStandardMaterial({
		transparent: true,
		map: doorColor,
		alphaMap: doorAlpha,
		aoMap: doorAmbientOcclusion,
		displacementMap: doorHeight,
		displacementScale: 0.1,
		normalMap: doorNormal,
		metalnessMap: doorMetalness,
		roughnessMap: doorRoughness,
	}),
)

door.position.z = 2.001
door.position.y = 1
house.add(door)

//bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

//graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
	map: stoneColor,
	aoMap: stoneao,
	normalMap: stoneNormal,
	roughness: stoneRoughness,
	displacementMap: stoneHeight,
})

for (let i = 0; i < 50; i++) {
	const grave = new THREE.Mesh(graveGeometry, graveMaterial)

	grave.material.roughness = 0.5
	const angle = Math.random() * Math.PI * 2
	const radius = 3.5 + Math.random() * 6
	const x = Math.sin(angle) * radius
	const z = Math.cos(angle) * radius

	grave.position.x = x
	grave.position.z = z
	grave.position.y = 0.3
	grave.rotation.y = (Math.random() - 0.5) * 0.4
	grave.rotation.z = (Math.random() - 0.5) * 0.3
	grave.castShadow = true
	graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({
		map: grassColor,
		aoMap: grassAO,
		normalMap: grassNormal,
		roughness: grassRoughness,
	}),
)
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
floor.material.roughness = 0.5
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, -2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)

const doorLight = new THREE.PointLight('#ff7d46', 1, 7) //intensity, distance fading
doorLight.position.set(0, 2.2, 2.7)

house.add(doorLight)

//ghosts
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
const ghost2 = new THREE.PointLight('#0000ff', 2, 3)
const ghost3 = new THREE.PointLight('#ffff00', 2, 3)

scene.add(ghost1, ghost2, ghost3)

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
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
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100,
)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

//shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost3.castShadow = true
ghost2.castShadow = true

walls.castShadow = true

bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true

floor.receiveShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
	const elapsedTime = clock.getElapsedTime()
	//update ghosts
	const ghostAngle = elapsedTime * 0.5
	const ghostAngle2 = -elapsedTime * 0.32
	const ghostAngle3 = -elapsedTime * 0.2

	ghost1.position.x = Math.cos(ghostAngle) * 4
	ghost1.position.z = Math.sin(ghostAngle) * 4
	ghost1.position.y = Math.sin(elapsedTime * 3)

	ghost2.position.x = Math.cos(ghostAngle2) * 5
	ghost2.position.z = Math.sin(ghostAngle2) * 5
	ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.25)

	ghost3.position.x =
		Math.cos(ghostAngle3) * (7 + Math.sin(elapsedTime * 0.32))
	ghost3.position.z = Math.sin(ghostAngle3) * (7 + Math.sin(elapsedTime * 0.5))
	ghost3.position.y =
		Math.sin(elapsedTime * 3.2) + Math.sin(elapsedTime * 0.25)

	// Update controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
