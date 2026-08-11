"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FiDownload, FiPlayCircle, FiTerminal, FiUser, FiGlobe, FiX } from "react-icons/fi";
import { SiCurseforge, SiModrinth, SiYoutube, SiDiscord, SiGithub, SiGamejolt, SiItchdotio } from "react-icons/si";
import styles from "./Minecraft3DRoom.module.css";
import { useLiveStats } from "@/context/LiveStatsContext";

interface StationInfo {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  position: THREE.Vector3;
}

export default function Minecraft3DRoom({ 
  onOpenTerminal,
  onOpenProjectsCategory 
}: { 
  onOpenTerminal?: () => void;
  onOpenProjectsCategory?: (category: string) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { totalDownloads, portfolioViews, platformTotals } = useLiveStats();
  
  const [hoveredStation, setHoveredStation] = useState<StationInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // ── Three.js Scene Setup ──────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#08080d");
    scene.fog = new THREE.FogExp2("#08080d", 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 2.2, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ── Lighting ──────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight("#202035", 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight("#64d2ff", 0.6);
    mainLight.position.set(5, 10, 5);
    scene.add(mainLight);

    // Flickering Candle Point Lights
    const candleLight1 = new THREE.PointLight("#ffaa33", 3.5, 12);
    candleLight1.position.set(-2.8, 1.8, -1.5);
    scene.add(candleLight1);

    const candleLight2 = new THREE.PointLight("#ff6611", 3.5, 12);
    candleLight2.position.set(2.8, 1.8, -1.5);
    scene.add(candleLight2);

    const centerGlowLight = new THREE.PointLight("#64d2ff", 2.0, 10);
    centerGlowLight.position.set(0, 1.0, 0);
    scene.add(centerGlowLight);

    // ── Materials ─────────────────────────────────────────────────────
    // Stone Brick Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: "#1a1a24",
      roughness: 0.85,
      metalness: 0.1,
    });

    // Dark Oak Wooden Floor
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: "#121016",
      roughness: 0.7,
      metalness: 0.1,
    });

    // Gold/Neon Accent Material
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: "#64d2ff",
      roughness: 0.3,
      metalness: 0.8,
      emissive: "#103050",
      emissiveIntensity: 0.5,
    });

    // ── Room Geometry (Stone Brick Sanctum) ──────────────────────────
    // Floor
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floor = new THREE.Mesh(floorGeo, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Back Wall
    const backWallGeo = new THREE.PlaneGeometry(16, 10);
    const backWall = new THREE.Mesh(backWallGeo, wallMaterial);
    backWall.position.set(0, 3.8, -4.5);
    scene.add(backWall);

    // Left Wall
    const leftWallGeo = new THREE.PlaneGeometry(16, 10);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMaterial);
    leftWall.position.set(-8, 3.8, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    // Right Wall
    const rightWallGeo = new THREE.PlaneGeometry(16, 10);
    const rightWall = new THREE.Mesh(rightWallGeo, wallMaterial);
    rightWall.position.set(8, 3.8, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // ── Interactive Stations (3D Meshes with Raycasting) ──────────────
    const interactiveMeshes: THREE.Mesh[] = [];

    // 1. RPG Weapon Banner Station (Left Wall)
    const bannerGeo = new THREE.BoxGeometry(0.1, 2.2, 1.2);
    const bannerMat = new THREE.MeshStandardMaterial({ color: "#8b0000", roughness: 0.4, emissive: "#300000" });
    const bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
    bannerMesh.position.set(-7.9, 1.8, -1.8);
    bannerMesh.userData = {
      id: "rpg-mods",
      title: "🗡️ RPG MODS & PACKS",
      subtitle: "Project Boss RPG, Project Horror, GunParty",
      icon: "sword",
    };
    scene.add(bannerMesh);
    interactiveMeshes.push(bannerMesh);

    // 2. YouTube Media Canvas Painting Station (Right Wall)
    const paintingGeo = new THREE.BoxGeometry(0.1, 1.8, 2.8);
    const paintingMat = new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.3, emissive: "#0f172a" });
    const paintingMesh = new THREE.Mesh(paintingGeo, paintingMat);
    paintingMesh.position.set(7.9, 2.0, -1.2);
    paintingMesh.userData = {
      id: "youtube-media",
      title: "📜 YOUTUBE BROADCAST",
      subtitle: "Latest Video Showcase & Trailers",
      icon: "play",
    };
    scene.add(paintingMesh);
    interactiveMeshes.push(paintingMesh);

    // 3. Structures & Addons Chest Station (Floor Left)
    const chestGeo = new THREE.BoxGeometry(1.2, 0.9, 1.0);
    const chestMat = new THREE.MeshStandardMaterial({ color: "#3f2817", roughness: 0.6 });
    const chestMesh = new THREE.Mesh(chestGeo, chestMat);
    chestMesh.position.set(-3.2, -0.75, -2.2);
    chestMesh.userData = {
      id: "structures-addons",
      title: "🧰 STRUCTURES & ADDONS",
      subtitle: "Spiral Dungeon of Babel, Structural Beyond",
      icon: "chest",
    };
    scene.add(chestMesh);
    interactiveMeshes.push(chestMesh);

    // 4. Terminal Control Console Desk Station (Floor Center Left)
    const termDeskGeo = new THREE.BoxGeometry(1.4, 0.8, 1.0);
    const termDeskMat = new THREE.MeshStandardMaterial({ color: "#1e1e24", roughness: 0.5 });
    const termDeskMesh = new THREE.Mesh(termDeskGeo, termDeskMat);
    termDeskMesh.position.set(-1.4, -0.8, 0.8);

    const termScreenGeo = new THREE.BoxGeometry(0.8, 0.6, 0.1);
    const termScreenMat = new THREE.MeshStandardMaterial({ color: "#00ff66", emissive: "#00aa44", emissiveIntensity: 0.8 });
    const termScreenMesh = new THREE.Mesh(termScreenGeo, termScreenMat);
    termScreenMesh.position.set(0, 0.7, 0);
    termDeskMesh.add(termScreenMesh);

    termDeskMesh.userData = {
      id: "terminal-console",
      title: "💻 TERMINAL CONTROL",
      subtitle: "Launch System Command Line",
      icon: "terminal",
    };
    scene.add(termDeskMesh);
    interactiveMeshes.push(termDeskMesh);

    // 5. 3D Character Skin Avatar Station (Center Room)
    const avatarBodyGeo = new THREE.BoxGeometry(0.8, 1.8, 0.5);
    const avatarMat = new THREE.MeshStandardMaterial({ color: "#0ea5e9", roughness: 0.4, emissive: "#0284c7", emissiveIntensity: 0.4 });
    const avatarMesh = new THREE.Mesh(avatarBodyGeo, avatarMat);
    avatarMesh.position.set(0, -0.3, -1.0);
    avatarMesh.userData = {
      id: "creator-bio",
      title: "👤 CREATOR STORY & SOCIALS",
      subtitle: "About D4VIDE106 & Social Matrix",
      icon: "user",
    };
    scene.add(avatarMesh);
    interactiveMeshes.push(avatarMesh);

    // 6. Live Metrics Trophy Pedestal Station (Floor Right)
    const trophyPedestalGeo = new THREE.CylinderGeometry(0.7, 0.8, 1.0, 16);
    const trophyPedestalMat = new THREE.MeshStandardMaterial({ color: "#eab308", roughness: 0.3, metalness: 0.9, emissive: "#ca8a04", emissiveIntensity: 0.5 });
    const trophyMesh = new THREE.Mesh(trophyPedestalGeo, trophyPedestalMat);
    trophyMesh.position.set(3.2, -0.7, -1.8);
    trophyMesh.userData = {
      id: "live-metrics",
      title: `🏆 LIVE METRICS: ${totalDownloads.toLocaleString()} DOWNLOADS`,
      subtitle: "Modrinth 30.7K | CurseForge 78.4K | GameJolt 593 | Itch 11",
      icon: "trophy",
    };
    scene.add(trophyMesh);
    interactiveMeshes.push(trophyMesh);

    // ── Mouse Raycasting & Interaction ────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh: THREE.Mesh | null = null;
    let targetCameraAngle = { x: 0, y: 2.2 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      // Smooth camera tilt
      targetCameraAngle.x = (mouse.x * 0.8);
      targetCameraAngle.y = 2.2 + (mouse.y * 0.4);

      // Raycast test
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, true);

      if (intersects.length > 0) {
        const topObject = intersects[0].object as THREE.Mesh;
        const rootMesh = (topObject.parent && topObject.parent !== scene ? topObject.parent : topObject) as THREE.Mesh;

        if (hoveredMesh !== rootMesh) {
          if (hoveredMesh) {
            (hoveredMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
          }
          hoveredMesh = rootMesh;
          (hoveredMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.9;
          container.style.cursor = "pointer";

          // Calculate screen 2D position for HTML tooltip
          const vector = rootMesh.position.clone();
          vector.project(camera);
          const screenX = ((vector.x + 1) * width) / 2;
          const screenY = ((-vector.y + 1) * height) / 2;

          setTooltipPos({ x: screenX, y: screenY });
          setHoveredStation({
            id: rootMesh.userData.id,
            title: rootMesh.userData.title,
            subtitle: rootMesh.userData.subtitle,
            icon: rootMesh.userData.icon,
            position: rootMesh.position,
          });
        }
      } else {
        if (hoveredMesh) {
          (hoveredMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
          hoveredMesh = null;
          container.style.cursor = "grab";
          setHoveredStation(null);
        }
      }
    };

    const handleClick = () => {
      if (hoveredMesh) {
        const stationId = hoveredMesh.userData.id;
        if (stationId === "terminal-console") {
          if (onOpenTerminal) onOpenTerminal();
        } else if (stationId === "rpg-mods") {
          if (onOpenProjectsCategory) onOpenProjectsCategory("Modpack");
          setActiveModal("rpg-mods");
        } else if (stationId === "structures-addons") {
          if (onOpenProjectsCategory) onOpenProjectsCategory("Mod");
          setActiveModal("structures-addons");
        } else {
          setActiveModal(stationId);
        }
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("click", handleClick);

    // ── Animation Loop ────────────────────────────────────────────────
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Flickering candle fire lights
      candleLight1.intensity = 3.2 + Math.sin(time * 8) * 0.6 + Math.cos(time * 12) * 0.4;
      candleLight2.intensity = 3.2 + Math.cos(time * 9) * 0.6 + Math.sin(time * 15) * 0.4;

      // Gentle floating animation on avatar mesh
      avatarMesh.position.y = -0.3 + Math.sin(time * 2) * 0.08;
      trophyMesh.rotation.y = time * 0.5;

      // Smooth camera interpolation
      camera.position.x += (targetCameraAngle.x - camera.position.x) * 0.05;
      camera.position.y += (targetCameraAngle.y - camera.position.y) * 0.05;
      camera.lookAt(0, 0.8, 0);

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize Listener ───────────────────────────────────────────────
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [totalDownloads, onOpenTerminal, onOpenProjectsCategory]);

  return (
    <div className={styles.roomSection}>
      {/* HUD Header Bar */}
      <div className={styles.hudControls}>
        <div className={styles.hudBadge}>
          <span className={styles.hudPulseDot} /> 🏰 MINECRAFT CREATOR SANCTUM 3D
        </div>
        <div className={styles.hudInstructions}>
          <span>💡 Move mouse to tilt camera • Click 3D objects to open popups</span>
        </div>
      </div>

      {/* Three.js Canvas Container */}
      <div ref={mountRef} className={styles.canvasContainer} />

      {/* Hover Object HTML Tooltip */}
      {hoveredStation && (
        <div 
          className={styles.objectTooltip}
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <span>{hoveredStation.title}</span>
          <span className={styles.tooltipSub}>{hoveredStation.subtitle}</span>
        </div>
      )}

      {/* Interactive 3D Station Modal Popups */}
      {activeModal && (
        <div className={styles.roomModalOverlay} onClick={() => setActiveModal(null)}>
          <div className={styles.roomModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setActiveModal(null)}>
              <FiX />
            </button>

            {/* Modal 1: Creator Bio & Social Matrix */}
            {activeModal === "creator-bio" && (
              <div>
                <h3 style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "#64d2ff" }}>👤 Creator Bio & Social Matrix</h3>
                <p style={{ color: "#e4e4e7", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                  I am a Minecraft mod developer and content creator pushing the boundaries of procedural worlds, custom boss progression, RPG mechanics, and world generation.
                </p>
                <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1rem" }}>
                  <a href="https://modrinth.com/user/D4vide106" target="_blank" rel="noreferrer" style={{ color: "#1bd96a" }}><SiModrinth size={22} /> Modrinth</a>
                  <a href="https://www.curseforge.com/members/d4vide106/projects" target="_blank" rel="noreferrer" style={{ color: "#f16436" }}><SiCurseforge size={22} /> CurseForge</a>
                  <a href="https://youtube.com/@d4vide106" target="_blank" rel="noreferrer" style={{ color: "#ff0000" }}><SiYoutube size={22} /> YouTube</a>
                  <a href="https://discord.gg/7T3u9a9" target="_blank" rel="noreferrer" style={{ color: "#5865F2" }}><SiDiscord size={22} /> Discord</a>
                </div>
              </div>
            )}

            {/* Modal 2: Live Download Statistics */}
            {activeModal === "live-metrics" && (
              <div>
                <h3 style={{ fontSize: "1.6rem", marginBottom: "0.8rem", color: "#eab308" }}>🏆 Live Download Metrics</h3>
                <h2 style={{ fontSize: "2.4rem", color: "#ffffff", marginBottom: "1.2rem" }}>{totalDownloads.toLocaleString()} Downloads</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "0.8rem 1.2rem", borderRadius: "12px" }}>
                    <span><SiModrinth color="#1bd96a" /> Modrinth Official API</span>
                    <strong>{platformTotals.modrinth?.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "0.8rem 1.2rem", borderRadius: "12px" }}>
                    <span><SiCurseforge color="#f16436" /> CurseForge Official API</span>
                    <strong>{platformTotals.curseforge?.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "0.8rem 1.2rem", borderRadius: "12px" }}>
                    <span><SiGamejolt color="#2fcc71" /> GameJolt Analytics</span>
                    <strong>{platformTotals.gamejolt?.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "0.8rem 1.2rem", borderRadius: "12px" }}>
                    <span><SiItchdotio color="#fa5c5c" /> Itch.io Dashboard</span>
                    <strong>{platformTotals.itch?.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Modal 3: YouTube Broadcast Showcase */}
            {activeModal === "youtube-media" && (
              <div>
                <h3 style={{ fontSize: "1.4rem", marginBottom: "1rem", color: "#ff453a" }}>📜 Latest YouTube Broadcast</h3>
                <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#000", borderRadius: "14px", overflow: "hidden" }}>
                  <iframe 
                    src="https://www.youtube.com/embed/8fnO7HA9wRY" 
                    title="YouTube Video" 
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Modal 4: RPG Mods */}
            {activeModal === "rpg-mods" && (
              <div>
                <h3 style={{ fontSize: "1.4rem", marginBottom: "0.8rem", color: "#8b0000" }}>🗡️ Featured RPG Mods & Modpacks</h3>
                <p style={{ color: "#a1a1a6" }}>Project Boss RPG, Project Horror, Project Realistic RPG, Project GunParty.</p>
              </div>
            )}

            {/* Modal 5: Structures & Addons */}
            {activeModal === "structures-addons" && (
              <div>
                <h3 style={{ fontSize: "1.4rem", marginBottom: "0.8rem", color: "#3f2817" }}>🧰 Structures & World Gen Addons</h3>
                <p style={{ color: "#a1a1a6" }}>Spiral Dungeon of Babel, Structural Beyond.</p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
