// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'; 
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js'; 
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js'; 
import Stats from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/libs/dat.gui.module.js';
var scene, camera, renderer
var car_model;
var global_gui;
var camX=0, camY=-50, camZ=50;
var carX=-30, carY=-40, carZ=0, carRotate = 0, carScale = 0.3;
var options = {
  carX: -30,
  carY: -40,
  carRotate: 0,
  camX: 0,
  camY: -50,
  camZ: 50,
  camera_control : false,
  camera: {
    speed: 0.0001
  },
  reset: function() {
    this.carX = -30;
    this.carY = -40;
    this.carRotate = 0;
    this.camX = 0;
    this.camY = -50;
    this.camZ = 50;        
    this.camera_control = false;
    car_model.position.set(carX, carY, carZ);
    camera.position.set(camX, camY, camZ);
  }
};

function create_scene() {  
  scene = new THREE.Scene();
  scene.background = new THREE.Color('skyblue'); 
}

function create_camera() {
  camera = new THREE.PerspectiveCamera( 100, window.innerWidth/window.innerHeight, 1, 1000 );  
  camera.position.set(camX, camY, camZ);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  //add gui of camera
  let cameraFolder = global_gui.addFolder('Camera')
  cameraFolder.add(camera.position, 'x', -100, 100).listen();
  cameraFolder.add(camera.position, 'y', -100, 100).listen();
  cameraFolder.add(camera.position, 'z', -100, 100).listen();
  cameraFolder.open()
}

function create_renderer() {
  // create rendering
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true;
}

function create_axes(params) {
  let axesHelper = new THREE.AxesHelper( 50 );  
  scene.add( axesHelper );
}

function create_ground(w, h) {
  var geo = new THREE.PlaneGeometry(w, h);  
  // load a texture, set wrap mode to repeat
  let groundTexture = new THREE.TextureLoader().load( "/images/green_grass.jpg");
  // let groundTexture = new THREE.TextureLoader().load( "/images/ground_stone3.jpg");
  groundTexture.wrapS = THREE.RepeatWrapping;
  groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set( 10, 10 );
  // var material = new THREE.MeshStandardMaterial({color: 0x666666,  side: THREE.DoubleSide,});
  var material = new THREE.MeshStandardMaterial({  map: groundTexture, });
  var mesh = new THREE.Mesh(geo, material);
  mesh.receiveShadow = true;  
  scene.add(mesh);
}

function create_light() {
  const light = new THREE.PointLight( 0xffffff, 1, 1000, 1 );
  light.position.set( -200, 200, 300 );
  light.castShadow = true; // default false
  scene.add( light );

  const light1 = new THREE.PointLight( 0xffffff, 1, 1000, 1 );
  light1.position.set( 200, -200, 300 );
  light1.castShadow = true; // default false
  scene.add( light1 );
}

function import_model(name,url) {  
  let loader = new GLTFLoader();
  loader.load(url, function(model_gltf){
    car_model=model_gltf.scene.children[0];      
    car_model.scale.set(carScale,carScale,carScale);
    scene.add(model_gltf.scene);
    car_model.rotateX(Math.PI/2);
    car_model.position.set(carX, carY, carZ); 
    //add gui of car
    let car_modelFolder = global_gui.addFolder(name)
    car_modelFolder.add(car_model.position, 'x', -100, 100).listen();
    car_modelFolder.add(car_model.position, 'y', -100, 100).listen();
    car_modelFolder.add(options,'carRotate', -3.141592, 3.141592).name('rotate').listen();
    car_modelFolder.open()
    
    global_gui.add(options, 'camera_control').listen();
    global_gui.add(options,"reset");
  }, undefined, function ( error ) {
    console.error( error );
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// function create_gui() {
//   let gui = new GUI;
  
//   global_gui = gui.addFolder('Controls');
//   global_gui.add(options, 'Camera');
//   global_gui.add(options, 'Car');
//   global_gui.open();
// }

function init() {  
  global_gui = new GUI();
  create_scene();
  create_camera();
  create_renderer();
  create_axes();
  create_ground(2000, 2000);
  create_light();
  import_model('Car', '/models/cars/fenyr_super_sport/scene.gltf');//importing model of car
  //Add stats
  const stats = Stats()
  document.body.appendChild(stats.dom)
  // add control of camera
  var cameral_control = new OrbitControls(camera, renderer.domElement);
  cameral_control.addEventListener('change', renderer);

  window.addEventListener('resize', onWindowResize)
  
  scene_rendering();
}
// function animate() {
//   requestAnimationFrame(animate)
//   cube.rotation.x += 0.01
//   cube.rotation.y += 0.01
//   controls.update()
//   render()
//   stats.update()
// }

function scene_rendering() {
	requestAnimationFrame( scene_rendering );
	renderer.render( scene, camera );
  
}

init();