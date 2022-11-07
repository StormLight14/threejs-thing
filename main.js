import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(0);

//Render the camera and scene
renderer.render( scene, camera );

//Create the torus shape
const geometry = new THREE.TorusGeometry( 10/2, 3/2, 16/2, 100 );
const material = new THREE.MeshStandardMaterial( { color: 0x0339fc});
const torus = new THREE.Mesh( geometry, material );

torus.position.z = 12;
torus.position.x = -10;
torus.position.y = 0;
scene.add(torus)

//Add pointLight and ambientLight to the scene
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(10, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight, pointLight);

/*
//Add a grid and show pointLight position
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);
*/

//Allow rotating view with mouse
const controls = new OrbitControls(camera, renderer.domElement);

//Add 100 stars randomly
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( { color: 0xEEEEEE});
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) );

  star.position.set(x, y, z);
  scene.add(star);
}

Array(100).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

//Dirt Block

const dirtTexture = new THREE.TextureLoader().load('dirt.jpg');

const dirt = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( { map: dirtTexture })
);

dirt.position.x -= 10;
dirt.position.z = -5;
scene.add(dirt);

// Moon texture and normal map

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.x += 20;
moon.position.z = 1;



// Called when scrolling
function moveCamera() {

  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  dirt.rotation.y += 0.01;
  dirt.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;

}

document.body.onscroll = moveCamera

//Constantly rotate and render the shape
function animate() {
  requestAnimationFrame ( animate );
  
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render( scene, camera );
}

animate();