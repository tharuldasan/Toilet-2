// model.js - Complete Three.js Code for OBJ/MTL Viewer

// Global variables for scene setup
let scene, camera, renderer, controls;
const ASSETS_PATH = './assets/'; // Path to the assets folder

function init() {
    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc); // Light gray background

    // 2. Camera Setup (PerspectiveCamera)
    // IMPORTANT FIX: Increased the 'far' clipping plane to 100000 
    // to prevent the model from disappearing when zooming out.
    // Syntax: PerspectiveCamera( fov, aspect, near, far )
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000); 
    camera.position.z = 5; // Initial camera position

    // 3. Renderer Setup (WebGL)
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 4. Lighting - Essential for seeing the model and its materials
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 5, 5); // Light source position
    scene.add(directionalLight);

    // 5. OrbitControls (Allows user to rotate, pan, and zoom the camera)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.autoRotate = true; // Uncomment to make the model spin automatically
    
    // 6. Load the Model
    loadModel();

    // 7. Handle Window Resize
    window.addEventListener('resize', onWindowResize, false);
}

function loadModel() {
    // Instantiate an MTL loader
    const mtlLoader = new THREE.MTLLoader();
    
    // Set the path to the texture/material files
    mtlLoader.setPath(ASSETS_PATH); 

    // 1. Load the MTL file first (to get material data)
    mtlLoader.load(
        'model.mtl', // Your MTL file name (change if yours is different)
        function (materials) {
            materials.preload();
            
            // Instantiate an OBJ loader
            const objLoader = new THREE.OBJLoader();
            
            // Set the loaded materials to the OBJ loader
            objLoader.setMaterials(materials);
            objLoader.setPath(ASSETS_PATH);

            // 2. Load the OBJ file
            objLoader.load(
                'model.obj', // Your OBJ file name (change if yours is different)
                function (object) {
                    // Optional: Adjust model position and scale if needed
                    // object.scale.set(0.1, 0.1, 0.1); 
                    // object.position.y = -1;
                    
                    scene.add(object);
                    console.log("Model loaded successfully!");
                },
                // Progress callback
                function (xhr) {
                    // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                // Error callback
                function (error) {
                    console.error('An error happened while loading OBJ:', error);
                }
            );
        },
        // Error callback
        function (error) {
            console.error('An error happened while loading MTL:', error);
        }
    );
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update controls (for user interaction)
    controls.update();

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the application
init();
animate();