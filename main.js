import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';

let scene, camera, renderer, controls, loader, model, effect, testSphere, testBox;

// Initialize Scene, Camera, and Renderer
function init() {
    // Scene
    scene = new THREE.Scene();
    

    // Camera (Perspective)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3, 2, 3);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    scene.background = new THREE.Color(0x02314D);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    

    // Test Sphere with Blue Standard Material
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2, 32, 32);

    let sphereMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0, 0.75, 0.75)
    });
/*
    sphereMaterial.userData.outlineParameters = {
       thickness: 0.2,
       color: new THREE.Color(0x123433),
       alpha: 1,
       visible: true
    };
    
*/
    testSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    testSphere.position.set(-2, 1, 0);

    testBox = new THREE.Mesh(cubeGeometry, sphereMaterial);
    testBox.position.set(2, 1, 0);

    // Outline effect
    // Outline effect
// Outline effect with specific default settings
effect = new OutlineEffect(renderer, {
    defaultThickness: 0.005,   // Outline thickness
    defaultColor: [0, 0.6, 0.2], // Set default outline color (RGB values, green in this case)
    defaultAlpha: 1.0,         // Alpha value for outline
    defaultKeepAlive: true     // Keep outline in memory for meshes not in scene
});


    // Add the test objects to the scene
    //scene.add(testSphere);
    //scene.add(testBox);

    // Load GLTF model from a path
    loadModelFromPath('Nexio4-V5.glb');  // Update this path to your actual model path

    // Render Loop
    animate();
}


// Load GLB Model from Path
function loadModelFromPath(path) {
    loader = new GLTFLoader();
    loader.load(path, function (gltf) {
        if (model) scene.remove(model);  // Remove the previous model if any
        model = gltf.scene;

        model.traverse((child) => {
            if (child.isMesh) {
                // Set up the original material to preserve the original appearance
                child.material.userData.outlineParameters = {
                    thickness: 0.01, // Outline thickness
                    color: new THREE.Color(0xFFFF00), // Outline color (green)
                    visibleEdgeColor: new THREE.Color(0x00FF00), // Visible edge color (green)
                    hiddenEdgeColor: new THREE.Color(0x00FF00),  // Hidden edge color (green)
                };
            }
        });

        scene.add(model);
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        model.rotation.set(0, 0, 0);
    },
    undefined, // onProgress callback
    function (error) {
        console.error('An error occurred loading the GLB model:', error);
    });
}

// Animate and render
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    effect.render(scene, camera);
}

// Adjust canvas on window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize viewer
init();