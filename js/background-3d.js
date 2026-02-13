// 3D Background with Three.js - Neural Particle Network

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
});

function initThreeJS() {
    // Create canvas container if it doesn't exist
    let container = document.getElementById('canvas-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'canvas-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '-1';
        container.style.pointerEvents = 'none'; // Allow clicks to pass through
        document.body.prepend(container);
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 1000;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Particles setup
    const particleCount = window.innerWidth < 768 ? 120 : 300;
    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleData = []; // Store velocity/data for each particle

    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;

        particlePositions[i * 3] = x;
        particlePositions[i * 3 + 1] = y;
        particlePositions[i * 3 + 2] = z;

        // Add some random movement data
        particleData.push({
            velocity: new THREE.Vector3(
                -1 + Math.random() * 2,
                -1 + Math.random() * 2,
                -1 + Math.random() * 2
            ),
            numConnections: 0
        });
    }

    particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Material for particles
    const pMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 6,
        blending: THREE.AdditiveBlending,
        transparent: true,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);

    // Lines setup
    const segments = particleCount * particleCount;
    const linePositions = new Float32Array(segments * 3);
    const lineColors = new Float32Array(segments * 3);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', onDocumentMouseMove);

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) * 0.5;
        mouseY = (event.clientY - windowHalfY) * 0.5;
    }

    // Resize handler
    window.addEventListener('resize', onWindowResize);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Move particles
        for (let i = 0; i < particleCount; i++) {
            // Get current position
            let x = particlePositions[i * 3];
            let y = particlePositions[i * 3 + 1];
            let z = particlePositions[i * 3 + 2];

            // Update position based on velocity
            const v = particleData[i].velocity;
            x += v.x;
            y += v.y;
            z += v.z;

            // Boundary check - bounce back
            if (x < -1000 || x > 1000) v.x = -v.x;
            if (y < -1000 || y > 1000) v.y = -v.y;
            if (z < -1000 || z > 1000) v.z = -v.z;

            particlePositions[i * 3] = x;
            particlePositions[i * 3 + 1] = y;
            particlePositions[i * 3 + 2] = z;
        }

        particles.attributes.position.needsUpdate = true;

        // Update lines
        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0;

        for (let i = 0; i < particleCount; i++) {
            particleData[i].numConnections = 0;
        }

        // O(N^2) loop to find connections
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = particlePositions[i * 3] - particlePositions[j * 3];
                const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
                const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < 250) { // Connection threshold
                    particleData[i].numConnections++;
                    particleData[j].numConnections++;

                    // Alpha based on distance
                    const alpha = 1.0 - dist / 250;

                    linePositions[vertexpos++] = particlePositions[i * 3];
                    linePositions[vertexpos++] = particlePositions[i * 3 + 1];
                    linePositions[vertexpos++] = particlePositions[i * 3 + 2];

                    linePositions[vertexpos++] = particlePositions[j * 3];
                    linePositions[vertexpos++] = particlePositions[j * 3 + 1];
                    linePositions[vertexpos++] = particlePositions[j * 3 + 2];

                    // Gradient color: Cyan to Magenta
                    lineColors[colorpos++] = 0; // R
                    lineColors[colorpos++] = 1; // G
                    lineColors[colorpos++] = 1; // B

                    lineColors[colorpos++] = 1; // R
                    lineColors[colorpos++] = 0; // G
                    lineColors[colorpos++] = 1; // B

                    numConnected++;
                }
            }
        }

        linesMesh.geometry.setDrawRange(0, numConnected * 2);
        linesMesh.geometry.attributes.position.needsUpdate = true;
        linesMesh.geometry.attributes.color.needsUpdate = true;

        // Rotate the whole system slowly
        const time = Date.now() * 0.0005;
        scene.rotation.y = time * 0.1;

        // Gentle camera movement based on mouse
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();
}
