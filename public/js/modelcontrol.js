// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'; 
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js'; 
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js'; 
import Stats from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/libs/dat.gui.module.js';
var scene, camera, renderer

function create_camera() {
  let cam = new THREE.PerspectiveCamera( 100, window.innerWidth/window.innerHeight, 1, 1000 );  
  cam.position.set(0,-50,50);
  cam.lookAt(new THREE.Vector3(0, 0, 0));
  //add gui of camera
  let gui = new GUI();
  let cameraFolder = gui.addFolder('Camera')
  cameraFolder.add(cam.position, 'x', -100, 100)
  cameraFolder.add(cam.position, 'y', -100, 100)
  cameraFolder.add(cam.position, 'z', -100, 100)
  cameraFolder.open()
  return cam;
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
  light.position.set( -100, 100, 200 );
  light.castShadow = true; // default false
  scene.add( light );

  const light1 = new THREE.PointLight( 0xffffff, 1, 1000, 1 );
  light1.position.set( 100, -100, 200 );
  light1.castShadow = true; // default false
  scene.add( light1 );
}

function import_model(name,url) {  
  let loader = new GLTFLoader();
  loader.load(url, function(gltf){
    var _obj=gltf.scene.children[0];        
    _obj.scale.set(0.2,0.2,0.2);
    scene.add(gltf.scene);
    _obj.rotateX(Math.PI/2);
    _obj.position.set(-30, -40, 0);    
    let gui = new GUI()
    //add gui of car
    let _objFolder = gui.addFolder(name)
    _objFolder.add(_obj.scale, 'x', 0.1, 0.3)
    _objFolder.add(_obj.scale, 'y', 0.1, 0.3)
    _objFolder.add(_obj.scale, 'z', 0.1, 0.3)
    _objFolder.open()
  }, undefined, function ( error ) {
    console.error( error );
  });
}

function create_renderer() {
  // create rendering
  renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function init() {
  //************************ Creat Scene ****************************** */
  scene = new THREE.Scene();
  scene.background = new THREE.Color('skyblue'); 
  //Add stats
  const stats = Stats()
  document.body.appendChild(stats.dom)

  camera = create_camera();
  create_axes();
  create_ground(2000, 2000);
  create_light();
  import_model('Car', '/models/cars/fenyr_super_sport/scene.gltf');//importing model of car
  create_renderer();
  // add control of camera
  var cameral_control = new OrbitControls(camera, renderer.domElement);
  cameral_control.addEventListener('change', renderer);

  window.addEventListener('resize', onWindowResize)

  update(renderer, scene, camera);
}

function update(renderer, scene, camera) {
  renderer.render(scene, camera);            
  requestAnimationFrame(function() {
    update(renderer, scene, camera);
  })
}

init();