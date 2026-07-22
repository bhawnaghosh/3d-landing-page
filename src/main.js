import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const tl = gsap.timeline();
tl.from("#hero-content h1", { y: 50, opacity: 0, duration: 1 })
  .from("#hero-content p", { x: 50, opacity: 0, duration: 1 }, "-=0.5")
  .from("#hero-content button", { y: 50, opacity: 0, duration: 1 }, "-=0.5");

gsap.from("#features h2", {
  y: 100, opacity: 0, duration: 1,
  scrollTrigger: { trigger: "#features", start: "top 80%", toggleActions: "play none none reverse" }
});

gsap.from("#about h2", {
  scale: 0.5, opacity: 0, duration: 1,
  scrollTrigger: { trigger: "#about", start: "top 80%", toggleActions: "play none none reverse" }
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#hero-canvas"),
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const geometry = new THREE.IcosahedronGeometry(1.5, 0);
const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc, roughness: 0.3, metalness: 0.7 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.x = 3.5;
scene.add(mesh);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const keyLight = new THREE.DirectionalLight(0xffffff, 2);
keyLight.position.set(3, 3, 5);
scene.add(keyLight);
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.003;

  camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
  camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const scrollTl = gsap.timeline({
  scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1 }
});

scrollTl.to(mesh.rotation, { y: Math.PI * 2 }, 0)
        .to(mesh.scale, { x: 0.4, y: 0.4, z: 0.4 }, 0)
        .to(mesh.position, { x: 5, y: -1 }, 0);

if (!reduceMotion) animate();
else renderer.render(scene, camera);
