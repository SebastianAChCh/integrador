import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

//Invocando el canvas
const canvas = document.querySelector('#webgl');

//Creando el encargado de renderizar todo, es decir, de convertirlo a algo que el
//navegador pueda ver correctamente
//Tambien le indicamos donde los ira a renderizar
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
//Le asignamos un tamaño al canva
renderer.setSize(window.innerWidth, window.innerHeight);

//Creamos una escena, es basicamente la base, donde se colocaran los elementos 3D
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe3dd);

//Esta es la encargada de poder visualizar los elementos
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight
);
camera.position.set(0, 1, 10);

//El que cargara los modelos 3d
const loader = new GLTFLoader();
loader.load('/MainPage/shiba.glb', (gltf) => {
  scene.add(gltf.scene);
});

//Las luces
const light1 = new THREE.PointLight(0x8c8c8c, 20, 100);
light1.position.set(50, 30, 50);
scene.add(light1);

const light2 = new THREE.PointLight(0x8c8c8c, 10, 100);
light2.position.set(-50, 30, 50);
scene.add(light2);

const light3 = new THREE.PointLight(0x8c8c8c, 2, 100);
light3.position.set(0, 30, -5);
scene.add(light3);

//Los controles, para poder mover el elemento 3d
const controls = new OrbitControls(camera, canvas);

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();
