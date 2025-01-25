import { Github, LucideLinkedin } from "lucide-react";
import styles from "./footer.module.css";

function Footer() {
 return (
  <footer>
   <div className={styles["footer-wrapper"]}>
    <div className={styles["top-footer"]}>
     <div data-testid="about" className={styles.content}>
      <div className={styles.title}>Shoppers</div>
      <div className={styles.about}>About</div>
      <div className={styles.career}>Career</div>
      <div className={styles.blog}>Blog</div>
      <div className={styles.sale}>Sale</div>
     </div>
     <div data-testid="help" className={styles.content}>
      <div className={styles.title}>Guide and Help</div>
      <div className={styles.about}>Help</div>
      <div className={styles.career}>Terms and Condition</div>
      <div className={styles.blog}>Privacy</div>
      <div className={styles.sale}>Contact Us</div>
     </div>
     <div
      data-testid="socials-media"
      className={`${styles.content} ${styles.socials}`}
     >
      <div className={styles.title}>Follow</div>
      <a
       href="https://github.com/Delfiald"
       target="_blank"
       rel="noopener noreferrer"
      >
       <div className={styles["displayed"]}>
        <Github size={24} title="Github" />
       </div>
       <div className={styles["hovered"]}>
        <Github size={24} title="Github Hovered" />
       </div>
      </a>
      <a
       href="https://linkedin.com/in/m-aldi-gunawan"
       target="_blank"
       rel="noopener noreferrer"
      >
       <div className={styles["displayed"]}>
        <LucideLinkedin size={24} title="Linkedin" />
       </div>
       <div className={styles["hovered"]}>
        <LucideLinkedin size={24} title="Linkedin  Hovered" />
       </div>
      </a>
     </div>
     <div data-testid="apps" className={`${styles.content} ${styles.apps}`}>
      <div className={styles.title}>Download Apps</div>
      <div>
       <img src="/Stores/google-play.svg" alt="Google Play" />
       <p>GET IT ON</p>
       <p>Google Play</p>
      </div>
      <div className={styles["app-store"]}>
       <img src="/Stores/app-store.svg" alt="App Store" />
       <p>Download on the</p>
       <p>App Store</p>
      </div>
      <div>
       <img src="/Stores/huawei-app-gallery.svg" alt="AppGallery" />
       <p>EXPLORE IT ON</p>
       <p>AppGallery</p>
      </div>
     </div>
    </div>
    <div className={styles["bottom-footer"]}>
     <p>&copy; MAG 2025</p>
    </div>
   </div>
  </footer>
 );
}

export default Footer;
