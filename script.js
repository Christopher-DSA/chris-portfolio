import * as THREE from 'three';
// Optional: OrbitControls for debugging
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Core Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050515);
scene.fog = new THREE.FogExp2(0x050515, 0.03);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// --- Lighting ---
scene.add(new THREE.AmbientLight(0x606080, 0.8));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(15, 30, 20);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
scene.add(directionalLight);

// --- Ground Plane (Sci-Fi Grid Style) ---
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a2a, metalness: 0.1, roughness: 0.9
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
const gridHelper = new THREE.GridHelper(100, 100, 0x00ffff, 0x444488);
gridHelper.position.y = 0.01;
scene.add(gridHelper);

// --- Drone ---
const droneGroup = new THREE.Group();
const bodyGeometry = new THREE.BoxGeometry(1, 0.4, 1.5);
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff, metalness: 0.6, roughness: 0.3 });
const droneBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
droneBody.castShadow = true;
droneGroup.add(droneBody);
const propGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 8);
const propMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.5 });
const prop1 = new THREE.Mesh(propGeometry, propMaterial); prop1.position.set(0.6, 0.2, 0.5); prop1.castShadow = true; droneGroup.add(prop1);
const prop2 = new THREE.Mesh(propGeometry, propMaterial); prop2.position.set(-0.6, 0.2, 0.5); prop2.castShadow = true; droneGroup.add(prop2);
const prop3 = new THREE.Mesh(propGeometry, propMaterial); prop3.position.set(0.6, 0.2, -0.5); prop3.castShadow = true; droneGroup.add(prop3);
const prop4 = new THREE.Mesh(propGeometry, propMaterial); prop4.position.set(-0.6, 0.2, -0.5); prop4.castShadow = true; droneGroup.add(prop4);
droneGroup.position.set(0, 1, 0);
scene.add(droneGroup);
const drone = droneGroup;

// --- Zones Definition ---
const zones = [
    {
        name: "Hub Zone",
        position: new THREE.Vector3(0, 0, 0),
        radius: 10,
        color: 0x5555ff, // Blueish marker
        title: "Welcome Hub",
        // No iconUrl for the main hub for now
        info: `
            <p>Welcome to my interactive portfolio!</p>
            <p>Controls: [WASD] Fly | [R/F] Altitude | [Shift] Sprint</p>
            <p>Fly into the glowing zones to explore my projects.</p>
            <ul>
                <li>REFit (Green)</li>
                <li>Sofvie (Orange)</li>
                <li>Focus Mode (Magenta)</li>
                <li>Skills/Edu (Grey)</li>
            </ul>
        `
    },
    {
        name: "REFit Zone",
        position: new THREE.Vector3(0, 0, -25),
        radius: 8,
        color: 0x00ff00, // Green marker
        title: "REFit Refrigerant Management",
        iconUrl: 'static/img/refitLogo192.png', // Green placeholder
        info: `
            <p><strong>Lead Software Developer (Dec 2023 - Present)</strong></p>
            <ul>
                <li>Built HVAC startup PWA (online/offline).</li>
                <li>JavaScript QR Code decoding for equipment tracking.</li>
                <li>Secure login & account system.</li>
                <li>Python/MailGun API for automated emails (verification, password reset, compliance docs).</li>
                <li>PostgreSQL DB setup & schema design.</li>
                <li>Mailchimp campaigns (34.4% open rate).</li>
                <li>Google Ads campaigns (8.5% CTR).</li>
            </ul>
            <p><em>Skills: Python, JavaScript, PostgreSQL, REST APIs, PWA, Full-Stack Dev, Digital Marketing</em></p>
        `
    },
    {
        name: "Sofvie Zone",
        position: new THREE.Vector3(-25, 0, 0),
        radius: 7,
        color: 0xffaa00, // Orange marker
        title: "Sofvie (Internship)",
        iconUrl: 'static/img/sofvie_inc_logo.jpg', // Orange placeholder
        info: `
            <p><strong>Junior Web App Developer (Oct - Nov 2023)</strong></p>
            <ul>
                <li>Led tasks within a cohort of 8 junior developers.</li>
                <li>Provided mentorship and guidance.</li>
                <li>Ensured project tasks completed on schedule.</li>
                <li>Internship success led directly to full-time role at client (REFit).</li>
            </ul>
            <p><em>Skills: Team Leadership, Project Management, Collaboration, Mentorship</em></p>
        `
    },
    {
        name: "Focus Mode Zone",
        position: new THREE.Vector3(25, 0, 0),
        radius: 6,
        color: 0xff00ff, // Magenta marker
        title: "Project: Focus Mode Extension",
        iconUrl: 'https://placehold.co/300x300/ff00ff/png?text=Focus', // Magenta placeholder
        info: `
            <p><strong>Chrome Web Extension</strong></p>
            <ul>
                <li>Enhances focus by blocking distracting sites.</li>
                <li>Users redirected to a customizable screen.</li>
                <li>Built with HTML, CSS, JavaScript.</li>
                <li>Published on Chrome Web Store.</li>
                <li><a href="https://chromewebstore.google.com/detail/focus-mode-website-blocke/mfmecppjdgdjooajmdjdbmnojgopachl" target="_blank" style="color: #00ffff;">View on Store</a></li>
            </ul>
            <p><em>Skills: JavaScript, HTML, CSS, Chrome Extensions API</em></p>
        `
    },
     {
        name: "Skills & Education Zone",
        position: new THREE.Vector3(0, 0, 25),
        radius: 7,
        color: 0xaaaaaa, // Grey marker
        title: "Skills & Education",
        iconUrl: 'https://placehold.co/300x300/aaaaaa/png?text=Skills', // Grey placeholder
        info: `
            <p><strong>Technical Skills:</strong></p>
            <ul>
                <li>Languages: JavaScript, Python, SQL (MySQL, PostgreSQL), HTML5, CSS3, Lua</li>
                <li>Frameworks/Libs: Flask, Bootstrap (Basic)</li>
                <li>Tools: Git, RESTful APIs, MailGun, Mailchimp, Google Ads</li>
                <li>Concepts: Full-Stack Dev, PWA, DB Design, Data Science Basics</li>
            </ul>
             <p><strong>Professional Skills:</strong> Project Management, Team Leadership, Communication, Analysis</p>
             <hr style="margin: 5px 0; border-color: #444;">
             <p><strong>Education:</strong> Lighthouse Labs - Data Science Diploma (Graduated Sep 2023)</p>
             <p><strong>Self-Taught:</strong> Web Development, Game Development (Lua)</p>
        `
    }
];

// --- Create Zone Visual Markers & Icons ---
const zoneMarkers = new THREE.Group();
const textureLoader = new THREE.TextureLoader();
const iconGeometry = new THREE.PlaneGeometry(2, 2); // Keep geometry reference for identification later
const iconYOffset = 3.5;

zones.forEach(zoneData => {
    // --- Ground Marker ---
    const markerGeo = new THREE.SphereGeometry(1, 16, 8);
    const markerMat = new THREE.MeshBasicMaterial({
        color: zoneData.color, transparent: true, opacity: 0.4, wireframe: true
    });
    const markerMesh = new THREE.Mesh(markerGeo, markerMat);
    markerMesh.position.set(zoneData.position.x, 0.1, zoneData.position.z);
    zoneMarkers.add(markerMesh);

    // --- Point Light ---
    const pointLight = new THREE.PointLight(zoneData.color, 2, zoneData.radius * 1.5);
    pointLight.position.set(zoneData.position.x, 2, zoneData.position.z);
    zoneMarkers.add(pointLight);

    // --- Floating Icon (If URL provided) ---
    if (zoneData.iconUrl) {
        const iconTexture = textureLoader.load(zoneData.iconUrl);
        const iconMaterial = new THREE.MeshBasicMaterial({
            map: iconTexture,
            transparent: true,
            side: THREE.DoubleSide,
        });
        const iconMesh = new THREE.Mesh(iconGeometry, iconMaterial); // Use shared geometry
        iconMesh.position.set(zoneData.position.x, iconYOffset, zoneData.position.z);
        zoneMarkers.add(iconMesh);
    }
});
scene.add(zoneMarkers);


// --- Controls ---
const keysPressed = {};
const moveSpeed = 7.0;
const turnSpeed = Math.PI / 2.5;
const altitudeSpeed = 4.0;
const sprintMultiplier = 1.75;
const inertiaFactor = 0.05;

let currentVelocity = new THREE.Vector3(0, 0, 0);
let currentAngularVelocity = 0;

document.addEventListener('keydown', (event) => { keysPressed[event.key.toLowerCase()] = true; });
document.addEventListener('keyup', (event) => { keysPressed[event.key.toLowerCase()] = false; });
window.addEventListener('blur', () => { Object.keys(keysPressed).forEach(key => keysPressed[key] = false); });
renderer.domElement.addEventListener('contextmenu', (event) => { event.preventDefault(); });


// --- UI Interaction ---
const zoneInfoDiv = document.getElementById('zone-info');
let currentZone = null;

// ** THIS IS THE SINGLE, CORRECT DEFINITION OF updateZoneInfo **
function updateZoneInfo(zone) {
    if (zone) {
        zoneInfoDiv.innerHTML = `<h3>${zone.title}</h3>${zone.info}`;
    } else {
        // Default text when not in a specific zone (but not the Hub)
         zoneInfoDiv.innerHTML = `<h3>Exploring...</h3><p>Fly towards one of the glowing markers to learn more.</p>`;
    }
}

// Set initial info to Hub Zone
const hubZone = zones.find(z => z.name === "Hub Zone");
if (hubZone) { currentZone = hubZone; updateZoneInfo(hubZone); }


// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();

    // --- Determine Effective Speeds (Sprint Check) ---
    const isSprinting = keysPressed['shift'] || false;
    const effectiveMoveSpeed = isSprinting ? moveSpeed * sprintMultiplier : moveSpeed;
    const effectiveTurnSpeed = isSprinting ? turnSpeed * sprintMultiplier : turnSpeed;

    // --- Determine Target Velocities based on Input ---
    let targetVelocityZ = 0;
    let targetAngularVelocity = 0;
    let altitudeChange = 0;

    if (keysPressed['w']) targetVelocityZ = -effectiveMoveSpeed;
    if (keysPressed['s']) targetVelocityZ = effectiveMoveSpeed;
    if (keysPressed['a']) targetAngularVelocity = effectiveTurnSpeed;
    if (keysPressed['d']) targetAngularVelocity = -effectiveTurnSpeed;
    if (keysPressed['r']) altitudeChange = altitudeSpeed * deltaTime;
    if (keysPressed['f']) altitudeChange = -altitudeSpeed * deltaTime;

    // --- Interpolate Current Velocities Towards Target ---
    const lerpAmount = 1.0 - Math.pow(inertiaFactor, deltaTime);
    currentVelocity.z = THREE.MathUtils.lerp(currentVelocity.z, targetVelocityZ, lerpAmount);
    currentAngularVelocity = THREE.MathUtils.lerp(currentAngularVelocity, targetAngularVelocity, lerpAmount);

    // --- Apply Smoothed Movement ---
    drone.rotation.y += currentAngularVelocity * deltaTime;
    const moveVector = new THREE.Vector3(0, 0, currentVelocity.z);
    moveVector.applyQuaternion(drone.quaternion);
    drone.position.add(moveVector.multiplyScalar(deltaTime));
    drone.position.y += altitudeChange;

    // Clamp small velocities to zero
    const stopThreshold = 0.01;
    if (Math.abs(currentVelocity.z) < stopThreshold && Math.abs(targetVelocityZ) < stopThreshold) currentVelocity.z = 0;
    if (Math.abs(currentAngularVelocity) < stopThreshold && Math.abs(targetAngularVelocity) < stopThreshold) currentAngularVelocity = 0;

    // Keep drone within altitude bounds
    drone.position.y = Math.max(0.5, Math.min(drone.position.y, 20));

    // --- Billboard Icons (Make them face the camera) ---
    zoneMarkers.children.forEach(child => {
        // Check if it's an icon mesh by checking its geometry
        if (child.geometry === iconGeometry) {
            child.lookAt(camera.position);
        }
    });

    // --- Simple Camera Follow ---
    const cameraOffset = new THREE.Vector3(0, 5, 10);
    const targetPosition = drone.position.clone().add(cameraOffset.applyQuaternion(drone.quaternion));
    const cameraLerpFactor = 1.0 - Math.pow(0.01, deltaTime);
    camera.position.lerp(targetPosition, cameraLerpFactor);
    const lookAtTarget = drone.position.clone().add(new THREE.Vector3(0, 0, -2).applyQuaternion(drone.quaternion));
    camera.lookAt(lookAtTarget);

    // --- Zone Interaction Logic ---
    let droneInAnyZone = false;
    for (const zone of zones) {
        const distanceXZ = new THREE.Vector2(drone.position.x - zone.position.x, drone.position.z - zone.position.z).length();
        if (distanceXZ < zone.radius) {
            droneInAnyZone = true;
            if (currentZone !== zone) {
                currentZone = zone;
                updateZoneInfo(zone); // Call the single defined function
            }
            break;
        }
    }
    if (!droneInAnyZone && currentZone !== null) {
         if (currentZone.name === "Hub Zone") {
             currentZone = null;
             updateZoneInfo(null); // Call the single defined function
         } else {
             currentZone = hubZone;
             updateZoneInfo(hubZone); // Call the single defined function
         }
    }

    renderer.render(scene, camera);
}

// --- Resize Handling ---
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// --- Start ---
animate();