import styles from "./Projects.module.css";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "Epic Minecraft Map",
    category: "Map Design",
    description: "A huge custom terrain map built with world-painter and custom assets.",
    image: "/project-1.jpg" // Placeholder
  },
  {
    id: 2,
    title: "Redstone Calculator",
    category: "Redstone Engineering",
    description: "A fully functional 8-bit calculator built entirely inside Minecraft.",
    image: "/project-2.jpg"
  },
  {
    id: 3,
    title: "Server Hub",
    category: "Architecture",
    description: "A massive floating island server hub with integrated minigames.",
    image: "/project-3.jpg"
  }
];

export default function Projects() {
  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          My <span className={styles.highlight}>Projects</span>
        </h2>
        
        <div className={styles.grid}>
          {projects.map((project) => (
            <div key={project.id} className={`${styles.card} glass`}>
              <div className={styles.imageContainer}>
                {/* Fallback div if image not found */}
                <div className={styles.imagePlaceholder}>
                   <span>{project.category}</span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <span className={styles.category}>{project.category}</span>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDesc}>{project.description}</p>
                <button className={styles.readMore}>View Project &rarr;</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
