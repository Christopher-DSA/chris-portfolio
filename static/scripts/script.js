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
const bodyGeometry = new THREE.BoxGeometry(1, 0.4, 1.5); // Width, Height, Depth
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
            <p>Controls: [WASD] Fly | [R/F] Altitude | [Shift] Sprint | [Space] Barrel Roll</p> <!-- Added Space control info -->
            <p>Fly into the glowing zones to explore my projects.</p>
            <ul>
                <li>REFit (Green - Ground)</li>
                <li>Sofvie (Orange - Ground)</li>
                <li>Website Blocker (Magenta - Ground)</li>
                <li>Skills/Education (Grey - Ground)</li>
                <li>Sky Project (Yellow - Elevated)</li>
            </ul>
        `
    },
    {
        name: "REFit Zone",
        position: new THREE.Vector3(0, 0, -25),
        radius: 8,
        color: 0x00ff00, // Green marker
        title: "REFit Refrigerant Management",
        iconUrl: 'static/img/refitLogo192.png',
        info: `
            <p><strong>Lead Software Developer (Dec 2023 - Present)</strong></p>
            <ul>
                <li>Built HVAC Web App for REFit. (online/offline).</li>
                <li>Created a visually appealing website for REFit with a focus on user experience.</li>
                <li>JavaScript QR Code decoding for equipment tracking.</li>
                <li>Secure login & account system.</li>
                <li>Python/MailGun API for automated emails (verification, password reset, compliance docs).</li>
                <li>PostgreSQL DB setup & schema design.</li>
                <li>Mailchimp campaigns (34.4% open rate).</li>
                <li>Google Ads campaigns (8.5% CTR).</li>
                <li><a href="https://refitmgmt.com/" target="_blank" style="color: #00ffff;">Visit REFit Website</a></li>
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
        iconUrl: 'static/img/sofvie_inc_logo.jpg',
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
        name: "Focus Mode Website Blocker: Chrome Extension Zone",
        position: new THREE.Vector3(25, 0, 0),
        radius: 6,
        color: 0xff00ff, // Magenta marker
        title: "Project: Focus Mode Extension",
        iconUrl: 'static/img/focusmodeIcon128.png',
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
        iconUrl: 'https://placehold.co/300x300/aaaaaa/png?text=Skills', // Use a placeholder or ideally create a simple skills icon
        info: `
            <p><strong>Technical Skills:</strong></p>
            <ul>
                <li>Languages: JavaScript, Python, SQL (MySQL, PostgreSQL), HTML5, CSS3, Lua</li>
                <li>Frameworks/Libs: Flask, Bootstrap, Chart.js, Datatables</li>
                <li>Tools: Git, RESTful APIs, MailGun, Mailchimp, Google Ads</li>
                <li>Concepts: Full-Stack Dev, PWA, DB Design, Data Science Basics</li>
            </ul>
             <p><strong>Professional Skills:</strong> Project Management, Team Leadership, Communication, Analysis</p>
             <hr style="margin: 5px 0; border-color: #444;">
             <p><strong>Education:</strong> Lighthouse Labs - Data Science Diploma (Graduated Sep 2023)</p>
             <p><strong>Self-Taught:</strong> Web Development, Game Development (Lua)</p>
        `
    },
    {
        name: "Sky Project Zone",
        position: new THREE.Vector3(15, 10, -15), // Position: X=15, Y=10 (Elevated!), Z=-15
        radius: 5, // Maybe slightly smaller radius
        color: 0xffff00, // Yellow marker
        title: "Project: Sky Platform (Example)",
        iconUrl: 'https://placehold.co/300x300/ffff00/png?text=Sky', // Yellow placeholder
        info: `
            <p><strong>Elevated Zone</strong></p>
            <ul>
                <li>This project zone is positioned higher up.</li>
                <li>Use [R] to ascend and reach it!</li>
            </ul>
        `
    }
];

// --- Create Zone Visual Markers & Icons ---
const zoneMarkers = new THREE.Group();
const textureLoader = new THREE.TextureLoader();
const iconGeometry = new THREE.PlaneGeometry(2, 2); // Shared geometry for icons
const iconYOffset = 3.5; // Offset relative to the zone's base Y
const glowSphereGeometry = new THREE.SphereGeometry(1.5, 16, 8); // Shared geometry for glow spheres

zones.forEach(zoneData => {
    const zoneBaseY = zoneData.position.y; // Get the base Y position for this zone

    // --- Ground/Base Marker (Subtle Wireframe) ---
    const markerGeo = new THREE.SphereGeometry(1, 16, 8);
    const markerMat = new THREE.MeshBasicMaterial({
        color: zoneData.color, transparent: true, opacity: 0.3, wireframe: true
    });
    const markerMesh = new THREE.Mesh(markerGeo, markerMat);
    markerMesh.position.set(zoneData.position.x, zoneBaseY + 0.1, zoneData.position.z);
    zoneMarkers.add(markerMesh);

    // --- Point Light (For illumination) ---
    const pointLight = new THREE.PointLight(zoneData.color, 2, zoneData.radius * 1.5);
    pointLight.position.set(zoneData.position.x, zoneBaseY + 1.5, zoneData.position.z);
    zoneData.pointLight = pointLight;
    zoneMarkers.add(pointLight);

    // --- Additive Glow Sphere (Visible Pulsing Source) ---
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: zoneData.color, transparent: true, opacity: 0.6,
        blending: THREE.AdditiveBlending, depthWrite: false
    });
    const glowMesh = new THREE.Mesh(glowSphereGeometry, glowMaterial);
    glowMesh.position.set(zoneData.position.x, zoneBaseY + 1.0, zoneData.position.z);
    zoneData.glowMesh = glowMesh;
    zoneMarkers.add(glowMesh);

    // --- Floating Icon (If URL provided) ---
    if (zoneData.iconUrl) {
        const iconTexture = textureLoader.load(zoneData.iconUrl);
        const iconMaterial = new THREE.MeshBasicMaterial({
            map: iconTexture, transparent: true, side: THREE.DoubleSide
        });
        const iconMesh = new THREE.Mesh(iconGeometry, iconMaterial);
        iconMesh.position.set(zoneData.position.x, zoneBaseY + iconYOffset, zoneData.position.z);
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
const inertiaFactor = 0.05; // Lower = more drift/inertia

let currentVelocity = new THREE.Vector3(0, 0, 0);
let currentAngularVelocity = 0;

// Barrel Roll State Variables
let isRolling = false;
let rollStartTime = 0;
const rollDuration = 0.6; // Duration of the barrel roll in seconds
const rollAngle = Math.PI * 2; // Full 360 degrees roll (2 * PI radians)

const clock = new THREE.Clock(); // Define clock globally for use in event listener and animate

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    keysPressed[key] = true;

    // Trigger Barrel Roll on Space press (only if not already rolling)
    if (key === ' ' && !isRolling) {
        isRolling = true;
        rollStartTime = clock.getElapsedTime(); // Record start time using the global clock
    }
});

document.addEventListener('keyup', (event) => { keysPressed[event.key.toLowerCase()] = false; });
window.addEventListener('blur', () => { Object.keys(keysPressed).forEach(key => keysPressed[key] = false); }); // Reset keys on window blur
renderer.domElement.addEventListener('contextmenu', (event) => { event.preventDefault(); }); // Prevent right-click menu


// --- UI Interaction ---
const zoneInfoDiv = document.getElementById('zone-info');
let currentZone = null;
const hubZone = zones.find(z => z.name === "Hub Zone"); // Get reference to Hub Zone

// Function to update the info panel
function updateZoneInfo(zone) {
    if (zone) {
        // Update Hub zone info if it changed (to include Barrel Roll control)
        if (zone.name === "Hub Zone" && !zone.info.includes("Barrel Roll")) {
             zone.info = `
                <p>Welcome to my interactive portfolio!</p>
                <p>Controls: [WASD] Fly | [R/F] Altitude | [Shift] Sprint | [Space] Barrel Roll</p>
                <p>Fly into the glowing zones to explore my projects.</p>
                <ul>
                    <li>REFit (Green - Ground)</li>
                    <li>Sofvie (Orange - Ground)</li>
                    <li>Website Blocker (Magenta - Ground)</li>
                    <li>Skills/Education (Grey - Ground)</li>
                    <li>Sky Project (Yellow - Elevated)</li>
                </ul>
            `;
        }
        zoneInfoDiv.innerHTML = `<h3>${zone.title}</h3>${zone.info}`;
    } else {
        // Default text when not in a specific zone (exploring state)
         zoneInfoDiv.innerHTML = `<h3>Exploring...</h3><p>Fly towards one of the glowing markers to learn more.</p>`;
    }
}

// Set initial info to Hub Zone
if (hubZone) { currentZone = hubZone; updateZoneInfo(hubZone); }


// --- Animation Loop ---

// Helper function to map a value from one range to another
function mapRange(value, inMin, inMax, outMin, outMax) {
  // Clamps value to input range before mapping
  const clampedValue = Math.max(inMin, Math.min(value, inMax));
  return ((clampedValue - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();
    const time = clock.getElapsedTime(); // Get total elapsed time

    // --- Determine Effective Speeds (Sprint Check) ---
    const isSprinting = keysPressed['shift'] || false;
    const effectiveMoveSpeed = isSprinting ? moveSpeed * sprintMultiplier : moveSpeed;
    const effectiveTurnSpeed = isSprinting ? turnSpeed * sprintMultiplier : turnSpeed;

    // --- Determine Target Velocities based on Input ---
    let targetVelocityZ = 0;
    let targetAngularVelocity = 0;
    let altitudeChange = 0;

    // Don't allow movement/turning input during barrel roll for smoother animation
    if (!isRolling) {
        if (keysPressed['w']) targetVelocityZ = -effectiveMoveSpeed;
        if (keysPressed['s']) targetVelocityZ = effectiveMoveSpeed;
        if (keysPressed['a']) targetAngularVelocity = effectiveTurnSpeed;
        if (keysPressed['d']) targetAngularVelocity = -effectiveTurnSpeed;
        if (keysPressed['r']) altitudeChange = altitudeSpeed * deltaTime;
        if (keysPressed['f']) altitudeChange = -altitudeSpeed * deltaTime;
    } else {
        // Optional: slightly decrease forward speed during roll?
        // currentVelocity.z *= 0.98;
    }


    // --- Interpolate Current Velocities Towards Target (Inertia) ---
    const lerpAmount = 1.0 - Math.pow(inertiaFactor, deltaTime); // Frame-rate independent lerp
    currentVelocity.z = THREE.MathUtils.lerp(currentVelocity.z, targetVelocityZ, lerpAmount);
    currentAngularVelocity = THREE.MathUtils.lerp(currentAngularVelocity, targetAngularVelocity, lerpAmount);

    // --- Apply Smoothed Movement (Position and Yaw Rotation) ---
    drone.rotation.y += currentAngularVelocity * deltaTime; // Yaw (turning)
    const moveVector = new THREE.Vector3(0, 0, currentVelocity.z);
    moveVector.applyQuaternion(drone.quaternion); // Rotate move vector by drone's orientation
    drone.position.add(moveVector.multiplyScalar(deltaTime));
    drone.position.y += altitudeChange; // Altitude change

    // --- Barrel Roll Logic ---
    if (isRolling) {
        const rollElapsedTime = time - rollStartTime;
        const rollProgress = Math.min(rollElapsedTime / rollDuration, 1.0); // Progress from 0.0 to 1.0

        // Apply rotation around the drone's local Z-axis (forward axis)
        // Using a smooth step function can make the start/end less abrupt (optional)
        const smoothRollProgress = THREE.MathUtils.smoothstep(rollProgress, 0, 1);
        drone.rotation.z = -rollAngle * smoothRollProgress; // Clockwise roll

        // Check if roll is finished
        if (rollProgress >= 1.0) {
            isRolling = false;
            drone.rotation.z = 0; // IMPORTANT: Reset roll rotation precisely to zero
        }
    }

    // Clamp small velocities to zero to prevent drifting
    const stopThreshold = 0.01;
    if (!isRolling) { // Only stop if not rolling
        if (Math.abs(currentVelocity.z) < stopThreshold && Math.abs(targetVelocityZ) < stopThreshold) currentVelocity.z = 0;
        if (Math.abs(currentAngularVelocity) < stopThreshold && Math.abs(targetAngularVelocity) < stopThreshold) currentAngularVelocity = 0;
    }

    // Keep drone within altitude bounds
    drone.position.y = Math.max(0.5, Math.min(drone.position.y, 20)); // Min 0.5, Max 20

    // --- Pulse Zone Lights & Glow Spheres ---
    const pulseSpeed = 2.0;
    const baseIntensity = 1.5;
    const pulseAmplitude = 1.0;
    const minIntensity = 0.3;
    const maxIntensity = baseIntensity + pulseAmplitude;
    const minGlowOpacity = 0.4;
    const maxGlowOpacity = 0.9;
    const pulseFactor = Math.sin(time * pulseSpeed);

    zones.forEach(zone => {
        if (zone.pointLight && zone.glowMesh) {
            const currentIntensity = mapRange(pulseFactor, -1, 1, minIntensity, maxIntensity);
            zone.pointLight.intensity = currentIntensity;
            const currentOpacity = mapRange(pulseFactor, -1, 1, minGlowOpacity, maxGlowOpacity);
            zone.glowMesh.material.opacity = currentOpacity;
        }
    });

    // --- Billboard Icons ---
    zoneMarkers.children.forEach(child => {
        if (child.geometry === iconGeometry) {
            child.lookAt(camera.position);
        }
    });

    // --- Simple Camera Follow ---
    const cameraOffset = new THREE.Vector3(0, 5, 10);
    const targetPosition = drone.position.clone().add(cameraOffset.applyQuaternion(drone.quaternion));
    // Apply barrel roll rotation to camera offset *if* drone is rolling, makes camera roll with drone
    // if (isRolling) {
    //     // This part is tricky and might need adjustment based on desired camera behavior during roll
    //     // For now, let's keep the camera stable relative to the horizon during the roll
    // }
    const cameraLerpFactor = 1.0 - Math.pow(0.01, deltaTime);
    camera.position.lerp(targetPosition, cameraLerpFactor);
    const lookAtTarget = drone.position.clone().add(new THREE.Vector3(0, 0, -2).applyQuaternion(drone.quaternion)); // Look slightly ahead
    // If rolling, keep camera looking at the drone's core position, not affected by roll? Or let it follow? Experiment needed.
    // For simplicity, we'll let the standard lookAt handle it; the target position doesn't roll.
    camera.lookAt(lookAtTarget);

    // --- Zone Interaction Logic ---
    let droneInAnyZone = false;
    for (const zone of zones) {
        const distanceXZ = new THREE.Vector2(drone.position.x - zone.position.x, drone.position.z - zone.position.z).length();
        if (distanceXZ < zone.radius) {
            droneInAnyZone = true;
            if (currentZone !== zone) {
                currentZone = zone;
                updateZoneInfo(zone);
            }
            break;
        }
    }
    if (!droneInAnyZone && currentZone !== null) {
         if (currentZone.name !== "Hub Zone") {
             currentZone = hubZone;
             updateZoneInfo(hubZone);
         } else {
              currentZone = null;
              updateZoneInfo(null);
         }
    }

    // --- Render the scene ---
    renderer.render(scene, camera);

} // End of animate function

// --- Resize Handling ---
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// --- Start ---
animate(); // Begin the animation loop