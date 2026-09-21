"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeHero() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x9ca3af, 4, 30);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x6b7280, 4, 30);
    pointLight2.position.set(-5, -4, 4);
    scene.add(pointLight2);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x374151,
      emissive: 0x4b5563,
      specular: 0x9ca3af,
      shininess: 90,
      flatShading: true,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x9ca3af,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(coreGeo, wireMat);
    wireMesh.scale.set(1.08, 1.08, 1.08);
    mainGroup.add(wireMesh);

    const cardGeo = new THREE.BoxGeometry(0.8, 1.2, 0.08);
    const cardColors = [0x6b7280, 0x9ca3af, 0x4b5563, 0x374151];
    const orbitCards = [];

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const radius = 3.2;
      const cardMat = new THREE.MeshPhongMaterial({
        color: cardColors[i],
        specular: 0xffffff,
        shininess: 100,
        transparent: true,
        opacity: 0.9,
        flatShading: true,
      });
      const card = new THREE.Mesh(cardGeo, cardMat);
      card.position.set(Math.cos(angle) * radius, Math.sin(i) * 0.4, Math.sin(angle) * radius);
      card.rotation.y = -angle + Math.PI / 2;
      orbitCards.push({ mesh: card, initialAngle: angle, speed: 0.006 + i * 0.002, radius });
      mainGroup.add(card);
    }

    const particlesCount = 280;
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 12;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xd1d5db,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let targetRotationX = 0;
    let targetRotationY = 0;

    function onMouseMove(event) {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const mouseX = (x / (rect.width || 1) - 0.5) * 2;
      const mouseY = (y / (rect.height || 1) - 0.5) * 2;
      targetRotationY = mouseX * 0.7;
      targetRotationX = mouseY * 0.5;
    }
    window.addEventListener("mousemove", onMouseMove);

    function onResize() {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    let time = 0;
    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      time += 0.015;

      coreMesh.rotation.y += 0.008;
      coreMesh.rotation.x = Math.sin(time * 0.8) * 0.2;
      wireMesh.rotation.y -= 0.005;
      wireMesh.rotation.z += 0.003;

      orbitCards.forEach((item, idx) => {
        const curAngle = item.initialAngle + time * 0.4;
        item.mesh.position.x = Math.cos(curAngle) * item.radius;
        item.mesh.position.z = Math.sin(curAngle) * item.radius;
        item.mesh.position.y = Math.sin(time + idx) * 0.35;
        item.mesh.rotation.y = -curAngle + Math.PI / 2;
        item.mesh.rotation.x = Math.cos(time * 0.5 + idx) * 0.15;
      });

      particles.rotation.y = time * 0.03;

      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      // dispose
      renderer.dispose();
      coreGeo.dispose();
      cardGeo.dispose();
      particleGeo.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}
