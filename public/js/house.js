// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'; 
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js'; 
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js'; 
function init() {
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  var camera = new THREE.PerspectiveCamera( 100, window.innerWidth/window.innerHeight, 1, 1000 );
  // transform objects
  camera.position.x = 0;
  camera.position.y = 5;
  camera.position.z = 10;
  camera.lookAt(new THREE.Vector3(0, 0, 0));


  var spotLight_01 = getSpotlight(0xffffff, 2);
  var spotLight_02 = getSpotlight(0xffffff, 1);
  scene.add(spotLight_01);
  scene.add(spotLight_02);  
  
  spotLight_01.position.x = 6;
  spotLight_01.position.y = 8;
  spotLight_01.position.z = -20;
  
  spotLight_02.position.x = -12;
  spotLight_02.position.y = 6;
  spotLight_02.position.z = -10;
  
  let loader = new GLTFLoader();
  loader.load('/models/house/scene.gltf', function(gltf){
    console.log("--load 3D model---")
    gltf.scene.children[0];        
    scene.add(gltf.scene);        
    console.log("--added 3D model to scene---")
  }, undefined, function ( error ) {
    console.error( error );
  });  
    
  var renderer = new THREE.WebGLRenderer();
  
  var controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', renderer);

  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);

  update(renderer, scene, camera);
}

function getSpotlight(color, intensity) {
  var light = new THREE.SpotLight(color, intensity);
  light.castShadow = true;            
  light.shadow.mapSize.x = 4096;
  light.shadow.mapSize.y = 4096;            
  return light;
}

function update(renderer, scene, camera) {
  renderer.render(scene, camera);            
  requestAnimationFrame(function() {
      update(renderer, scene, camera);
  })
}
init();