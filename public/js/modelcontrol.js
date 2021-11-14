// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js'; 
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/controls/OrbitControls.js'; 
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js'; 
import Stats from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/libs/dat.gui.module.js';

function init() {
  //************************ Creat Scene ****************************** */
  var scene = new THREE.Scene();
  scene.background = new THREE.Color('skyblue');

  //*********************** Creat Camera ************************* */
  var camera = new THREE.PerspectiveCamera( 100, window.innerWidth/window.innerHeight, 1, 1000 );
  // transform objects
  camera.position.set(0,-50,50);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // add Axes
  const axesHelper = new THREE.AxesHelper( 50 );
  scene.add( axesHelper );

  // add ground
  var ground = creat_ground(200, 200);
  scene.add(ground);


  //Create a PointLight and turn on shadows for the light
  const light = new THREE.PointLight( 0xffffff, 1, 1000, 1 );
  light.position.set( -100, 100, 200 );
  light.castShadow = true; // default false
  scene.add( light );

  const light1 = new THREE.PointLight( 0xffffff, 1, 1000, 1 );
  light1.position.set( 100, -100, 200 );
  light1.castShadow = true; // default false
  scene.add( light1 );

  //importing model of car
  let loader = new GLTFLoader();
  var car;
  //create GUI
  const gui = new GUI()

  loader.load('/models/cars/fenyr_super_sport/scene.gltf', function(gltf){
    car=gltf.scene.children[0];        
    car.scale.set(0.2,0.2,0.2);
    scene.add(gltf.scene);
    car.rotateX(Math.PI/2);
    car.position.set(0, 0, 0);    
    //add gui of car
    const carFolder = gui.addFolder('Car')
    carFolder.add(car.scale, 'x', 0.1, 0.3)
    carFolder.add(car.scale, 'y', 0.1, 0.3)
    carFolder.add(car.scale, 'z', 0.1, 0.3)
    carFolder.open()
  }, undefined, function ( error ) {
    console.error( error );
  });    
  
  //Add stats
  const stats = Stats()
  document.body.appendChild(stats.dom)
  
  //add gui of camera
  const cameraFolder = gui.addFolder('Camera')
  cameraFolder.add(camera.position, 'x', -100, 100)
  cameraFolder.add(camera.position, 'y', -100, 100)
  cameraFolder.add(camera.position, 'z', -100, 100)
  cameraFolder.open()

  // create rendering
  var renderer = new THREE.WebGLRenderer();
  
  // add control of camera
  var controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', renderer);

  //Add resize of windows
  window.addEventListener(
    'resize',
    () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    },
    false
  )

  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);

  update(renderer, scene, camera);
}

function update(renderer, scene, camera) {
  renderer.render(scene, camera);            
  requestAnimationFrame(function() {
      update(renderer, scene, camera);
  })
}


function creat_ground(w, h) {
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
  
  return mesh;
}
init();