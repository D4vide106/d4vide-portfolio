import { ArrowRight, Image as ImageIcon } from "lucide-react";
import styles from "./Projects.module.css";

const projects = [
  {
    id: 1,
    title: "Epic Minecraft Map",
    category: "Map Design",
    description: "A huge custom terrain map built with world-painter and custom assets."
  },
  {
    id: 2,
    title: "Redstone Calculator",
    category: "Redstone Engineering",
    description: "A fully functional 8-bit calculator built entirely inside Minecraft."
  },
  {
    id: 3,
    title: "Server Hub",
    category: "Architecture",
    description: "A massive floating island server hub with integrated minigames."
  }
];

export default function Projects({ dict }: { dict: any }) {
  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          {dict.title} <span className={styles.highlight}>{dict.highlight}</span>
        </h2>
        
        <div className={styles.grid}>
          {projects.map((project) => (
            <div key={project.id} className={`${styles.card} glass`}>
              <div className={styles.imageContainer}>
                <div className={styles.imagePlaceholder}>
                   <ImageIcon size={48} opacity={0.5} />
                </div>
              </div>
              <div className={styles.cardContent}>
                <span className={styles.category}>{project.category}</span>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDesc}>{project.description}</p>
                <button className={styles.readMore}>
                  {dict.viewProject} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
