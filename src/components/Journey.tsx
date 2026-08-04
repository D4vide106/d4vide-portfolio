import { Terminal, Network, Code } from "lucide-react";
import styles from "./Journey.module.css";

export default function Journey({ dict }: { dict: any }) {
  const skills = [
    {
      id: "scripting",
      icon: <Terminal size={32} className={styles.icon} />,
      title: dict.scripting,
      desc: dict.scriptingDesc
    },
    {
      id: "networking",
      icon: <Network size={32} className={styles.icon} />,
      title: dict.networking,
      desc: dict.networkingDesc
    },
    {
      id: "development",
      icon: <Code size={32} className={styles.icon} />,
      title: dict.development,
      desc: dict.developmentDesc
    }
  ];

  return (
    <section id="journey" className={styles.journeySection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          {dict.title} <span className={styles.highlight}>{dict.highlight}</span>
        </h2>
        
        <div className={styles.grid}>
          {skills.map((skill) => (
            <div key={skill.id} className={`${styles.card} glass`}>
              <div className={styles.iconWrapper}>
                <div className={styles.iconGlow}></div>
                {skill.icon}
              </div>
              <h3 className={styles.cardTitle}>{skill.title}</h3>
              <p className={styles.cardDesc}>{skill.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
