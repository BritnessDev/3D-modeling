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
car_set.px = -13;car_set.py = 0;car_set.pz = 0;
var pointlight1, pointlight2, light;
var animation_flag = false;
var time = 0;
var newPosition = new THREE.Vector3();
var matrix = new THREE.Matrix4();

var options = {
  carX: 0,
  carY: 0,  
  camX: 0,
  camY: 0,
  camZ: 0,
  animation_view:function () {
    if (!animation_flag){
      animation_flag = true;
      // camera.rotation.x=Math.PI;
      light.intensity = 1.2;
      light.distance = 500;
      pointlight1.visible = true;
      pointlight2.visible = true;
    } else{
      animation_flag = false;
      light.intensity = 1.2;
      light.distance = 2000;
      pointlight1.visible = false;
      pointlight2.visible = false;      
    }
  },
  reset: function() {
    car_model.position.set(car_set.px, car_set.py, car_set.pz);
    light.distance = 2000;
    light.intensity = 1.2;
    pointlight1.visible = false;
    pointlight2.visible = false;
    animation_flag = false;
    this.carX = car_set.px;
    this.carY = car_set.py;
    this.carRotate = 0;
    this.camX = car_set.px;
    this.camY = car_set.py-300;
    this.camZ = car_set.pz+300;  
    mapping_value();
  }
};

function create_scene() {  
  scene = new THREE.Scene();
  scene.background = new THREE.Color('skyblue'); 
}

function create_camera() {
  // camera = new THREE.PerspectiveCamera( 10000, window.innerWidth/window.innerHeight, 1, 1000 );  
  camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.set(0, car_set.py-300, car_set.pz+300);  
  // camera.rotateX(-Math.PI);
  // camera.rotateY(-Math.PI);
  // camera.lookAt(new THREE.Vector3(0, car_set.py, car_set.pz));
  // camera.rotateY(-Math.PI);
  camera.lookAt( scene.position );  
  let cameraFolder = global_gui.addFolder('Camera')
  cameraFolder.add(camera.position, 'x', -1000, 1000).listen();
  cameraFolder.add(camera.position, 'y', -1000, 1000).listen();
  cameraFolder.add(camera.position, 'z', -1000, 1000).listen();
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
  light = new THREE.PointLight( 0xffffff, 1.2, 2000, 1 );  
  light.castShadow = true; // default false
  light.position.set(car_set.px+37, car_set.py+70, car_set.pz+300);

  const geometry = new THREE.SphereGeometry( 0.3, 8, 8 );
  const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  pointlight1 = new THREE.Mesh( geometry, material );
  pointlight2 = new THREE.Mesh( geometry, material );

  var carlight1 = new THREE.SpotLight( 0xffffff, 2, 500, 0.3 );  
  var carlight2 = new THREE.SpotLight( 0xffffff, 2, 500, 0.3 );  

  var car_target1 = new THREE.Object3D();
  var car_target2=  new THREE.Object3D();  
  
  pointlight1.position.set(car_set.px+26, car_set.py+6, car_set.pz+7)
  carlight1.position.set(0,0,0);  
  car_target1.position.set(0,-20,0);
  carlight1.target = car_target1;
  pointlight1.add(carlight1);
  pointlight1.add(car_target1);  
  
  pointlight2.position.set(car_set.px+88, car_set.py+6, car_set.pz+7)
  carlight2.position.set(0,0,0);  
  car_target2.position.set(0,-20,0);    
  carlight2.target = car_target2;
  pointlight2.add(carlight2);
  pointlight2.add(car_target2);  

  // pointlight1.visible = false;
  // pointlight2.visible = false;
}

function import_model(name,url) {  
  let loader = new GLTFLoader();
  loader.load(url, function(model_gltf){
    car_model=model_gltf.scene.children[0];      
    car_model.scale.set(0.3, 0.3, 0.3);
    car_model.rotateX(Math.PI/2);
    car_model.add(camera);
    car_model.add(light);
    car_model.add(pointlight1);
    car_model.add(pointlight2);
    scene.add(model_gltf.scene);
    car_model.position.set(car_set.px, car_set.py, car_set.pz); 
    //add gui of car
    let car_modelFolder = global_gui.addFolder(name)
    car_modelFolder.add(car_model.position, 'x', -1000, 1000).listen();
    car_modelFolder.add(car_model.position, 'y', -1000, 1000).listen();
    car_modelFolder.add(car_model.position,'z', -1000, 1000).listen();
    car_modelFolder.open()
    
    global_gui.add(options, 'animation_view').name('Animation On/OFF');
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
  if(animation_flag) {        
    newPosition.x = car_model.position.x;
    newPosition.y = car_model.position.y-0.5;
    newPosition.z = car_model.position.z;
    car_model.position.copy(newPosition);

    var newLookAt = new THREE.Vector3();
    newLookAt.x=car_model.position.x;
    newLookAt.y=car_model.position.y-200;
    newLookAt.z=car_model.position.z-200;
    // car_model.lookAt(newPosition);

    if(car_model.position.y<-1000){
      car_model.position.y=1000;
    }
    
  }
	renderer.render( scene, camera );
  stats.update()
}

init();