// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'; 
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js'; 
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js'; 
import Stats from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/libs/dat.gui.module.js';

var scene, camera, renderer
var stats
var car_model;
var global_gui;
var car_set = {};
var camera_set = {};
car_set.px = 0;car_set.py = 0;car_set.pz = 0;car_set.scale = 0.3;
camera_set.cx = car_set.px;camera_set.cy = car_set.py;camera_set.cz = car_set.pz;
camera_set.px = car_set.px;camera_set.py = car_set.py+300;camera_set.pz = car_set.pz + 300;
var carlight, spherelight, carlight_target, light;


var options = {
  carX: 0,
  carY: 0,
  carRotate: 0,
  camX: 0,
  camY: 0,
  camZ: 0,
  camera_control : false,
  camera: {
    speed: 0.0001
  },
  reset: function() {
    this.carX = car_set.px;
    this.carY = car_set.py;
    this.carRotate = 0;
    this.camX = camera_set.px;
    this.camY = camera_set.py;
    this.camZ = camera_set.pz;        
    this.camera_control = false;
    car_model.position.set(car_set.px,car_set.py, car_set.pz);
    camera.position.set(camera_set.px, camera_set.py, camera_set.pz);    
    camera.lookAt(new THREE.Vector3(camera_set.cx, camera_set.cy, camera_set.cz));
  }
};

function create_scene() {  
  scene = new THREE.Scene();
  scene.background = new THREE.Color('skyblue'); 
}

function create_camera() {
  camera = new THREE.PerspectiveCamera( 300, window.innerWidth/window.innerHeight, 1, 1000 );  
  camera.position.set(camera_set.px, camera_set.py, camera_set.pz);  
  camera.lookAt(new THREE.Vector3(camera_set.cx, camera_set.cy, camera_set.cz));
  //add gui of camera
  let cameraFolder = global_gui.addFolder('Camera')
  cameraFolder.add(camera.position, 'x', -1000, 1000).listen();
  cameraFolder.add(camera.position, 'y', -1000, 1000).listen();
  cameraFolder.add(camera.position, 'z', -200, 200).listen();
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
  light = new THREE.PointLight( 0xffffff, 1, 200, 1 );
  // light.position.set( -200, 200, 200 );
  light.castShadow = true; // default false
  scene.add( light );
  
  const geometry = new THREE.SphereGeometry( 1, 32, 16 );
  const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  spherelight = new THREE.Mesh( geometry, material );
  scene.add( spherelight );
  carlight = new THREE.SpotLight( 0xffffff, 2, 150, 0.40 );
  scene.add(carlight);
  carlight_target = new THREE.Object3D();
  scene.add(carlight_target);  
  carlight.target = carlight_target;

}

function import_model(name,url) {  
  let loader = new GLTFLoader();
  loader.load(url, function(model_gltf){
    car_model=model_gltf.scene.children[0];      
    car_model.scale.set(car_set.scale, car_set.scale, car_set.scale);
    scene.add(model_gltf.scene);
    car_model.rotateX(Math.PI/2);
    car_model.position.set(car_set.px, car_set.py, car_set.pz); 
    //add gui of car
    let car_modelFolder = global_gui.addFolder(name)
    car_modelFolder.add(car_model.position, 'x', -1000, 1000).listen();
    car_modelFolder.add(car_model.position, 'y', -1000, 1000).listen();
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
  stats = Stats();
  document.body.appendChild(stats.dom)
  // add control of camera
  var cameral_control = new OrbitControls(camera, renderer.domElement);
  cameral_control.addEventListener('change', renderer);

  window.addEventListener('resize', onWindowResize)
  
  scene_rendering();
}

function scene_rendering() {
	requestAnimationFrame( scene_rendering );
  car_model.position.y -= 2;
  if(car_model.position.y<-1000){
    car_model.position.y=1000;
  }  
  camera.rotation.x=Math.PI;
  camera.position.set(car_model.position.x, car_model.position.y+200, car_model.position.z+200);
  camera.lookAt(new THREE.Vector3(car_model.position.x, car_model.position.y, car_model.position.z));
  light.position.set(car_model.position.x+13, car_model.position.y+30, car_model.position.z+100);
  carlight.position.set(car_model.position.x+13, car_model.position.y+3, car_model.position.z+5);
  spherelight.position.set(car_model.position.x+13, car_model.position.y+3, car_model.position.z+5);
  carlight_target.position.set(car_model.position.x+13, car_model.position.y-100, car_model.position.z+5);
  // camera.rotation.z +=0.01;
	renderer.render( scene, camera );
  stats.update()
}

init();