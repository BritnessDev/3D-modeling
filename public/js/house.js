// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'; 
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js'; 
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js'; 
function init() {
  var scene = new THREE.Scene();
  scene.background = new THREE.Color('skyblue');

  var camera = new THREE.PerspectiveCamera( 100, window.innerWidth/window.innerHeight, 1, 1000 );
  // transform objects
  camera.position.set(0,5,20);
  camera.lookAt(new THREE.Vector3(0, 20, 0));

  //Create a PointLight and turn on shadows for the light
  const light = new THREE.PointLight( 0xffffff, 5, 1000, 2 );
  light.position.set( -40, 20, -30 );
  light.castShadow = true; // default false
  scene.add( light );
  //Create a PointLight and turn on shadows for the light
  const light1 = new THREE.PointLight( 0xffffff, 2, 1000, 1 );
  light1.position.set( 40, 40, 30 );
  light1.castShadow = true; // default false
  scene.add( light1 );

  //Set up shadow properties for the light
  light.shadow.mapSize.width = 512; // default
  light.shadow.mapSize.height = 512; // default
  light.shadow.camera.near = 0.5; // default
  light.shadow.camera.far = 500; // default

  //Create a sphere that cast shadows (but does not receive them)
  const sphereGeometry = new THREE.SphereGeometry( 2, 32, 32 );
  const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
  const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  sphere.castShadow = true; //default is false
  sphere.receiveShadow = false; //default
  scene.add( sphere );
  sphere.position.set(-40, 20, -30)

  window.addEventListener(
    'resize',
    () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    },
    false
  )
  
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