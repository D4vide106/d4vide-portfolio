import { SiCurseforge, SiModrinth, SiYoutube, SiDiscord, SiGithub, SiTiktok, SiGamejolt, SiItchdotio } from "react-icons/si";
import { FiCode, FiTerminal, FiLayout, FiYoutube } from "react-icons/fi";
import { DiJava, DiJavascript1, DiReact } from "react-icons/di";
import styles from "./Hero.module.css";
import TotalDownloads from "./TotalDownloads";

export default function Hero({ dict, aboutDict }: { dict: any, aboutDict: any }) {
  const skills = [
    { icon: <DiJava size={28} />, name: "Java" },
    { icon: <DiJavascript1 size={28} />, name: "JavaScript" },
    { icon: <DiReact size={28} />, name: "React / Next" },
    { icon: <FiTerminal size={28} />, name: "Scripting" },
    { icon: <FiLayout size={28} />, name: "UI/UX" },
    { icon: <FiCode size={28} />, name: "Modding" }
  ];

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.container}>
        
        {/* Top Section: Avatar + Info */}
        <div className={styles.topSection}>
          <div className={styles.avatarCol}>
            <div className={styles.glow}></div>
            <img 
              src="https://mc-heads.net/body/_D4vide106_/right" 
              alt="_D4vide106_" 
              className={styles.avatarImage} 
            />
          </div>
          
          <div className={styles.infoCol}>
            <h1 className={styles.title}>
              <span className={styles.greeting}>{dict.greeting || "Hi, I'm"}</span>
              <span className={styles.name}>_D4vide106_</span>
              <span className={styles.aka}>AKA DAVIDE</span>
            </h1>
            
            <div className={styles.quickStats}>
              <span>{aboutDict.aboutStats?.age || "Age"}: 19</span>
              <span className={styles.dot}>•</span>
              <span>{aboutDict.aboutStats?.livingIn || "Living in"}: Italy 🇮🇹</span>
            </div>

            <p className={styles.description}>
              {aboutDict.aboutDesc1 || "I am a Minecraft mod developer and content creator."}
              <br/><br/>
              {aboutDict.aboutDesc2 || "I have a particular passion for creating immersive RPG experiences."}
            </p>

            <TotalDownloads />

            <div className={styles.socials}>
              <a href="https://modrinth.com/user/D4vide106" target="_blank" rel="noreferrer" className={styles.socialBtn} style={{"--hover-color": "#1bd96a"} as any} title="Modrinth">
                <SiModrinth size={22} />
              </a>
              <a href="https://www.curseforge.com/members/d4vide106/projects" target="_blank" rel="noreferrer" className={styles.socialBtn} style={{"--hover-color": "#f16436"} as any} title="CurseForge">
                <SiCurseforge size={22} />
              </a>
              <a href="https://youtube.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.socialBtn} style={{"--hover-color": "#ff0000"} as any} title="YouTube">
                <SiYoutube size={22} />
              </a>
              <a href="https://tiktok.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.socialBtn} style={{"--hover-color": "#ff0050"} as any} title="TikTok">
                <SiTiktok size={22} />
              </a>
              <a href="https://d4vide106.itch.io" target="_blank" rel="noreferrer" className={styles.socialBtn} style={{"--hover-color": "#fa5c5c"} as any} title="Itch.io">
                <SiItchdotio size={22} />
              </a>
              <a href="https://gamejolt.com/@D4vide106" target="_blank" rel="noreferrer" className={styles.socialBtn} style={{"--hover-color": "#ccff00"} as any} title="GameJolt">
                <SiGamejolt size={22} />
              </a>
              <a href="https://discord.gg/7T3u9a9" target="_blank" rel="noreferrer" className={styles.socialBtn} style={{"--hover-color": "#5865F2"} as any} title="Discord">
                <SiDiscord size={22} />
              </a>
              <a href="https://github.com/D4vide106" target="_blank" rel="noreferrer" className={styles.socialBtn} style={{"--hover-color": "#ffffff"} as any} title="GitHub">
                <SiGithub size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Skills Grid */}
        <div className={styles.skillsSection}>
          <h3 className={styles.skillsTitle}>Technologies & Skills</h3>
          <div className={styles.skillsGrid}>
            {skills.map(skill => (
              <div key={skill.name} className={styles.skillBox}>
                <div className={styles.skillIcon}>{skill.icon}</div>
                <span className={styles.skillName}>{skill.name}</span>
              </div>
            ))}
          </div>
          
          <div className={styles.youtubeBanner}>
            <div className={styles.ytBannerContent}>
              <div className={styles.ytIconWrapper}>
                <FiYoutube className={styles.ytIcon} />
              </div>
              <div className={styles.ytText}>
                <h4>Subscribe to my YouTube Channel</h4>
                <p>Check out my latest videos, tutorials, and showcases!</p>
              </div>
            </div>
            <a href="https://www.youtube.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.ytButton}>
              Visit Channel
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
