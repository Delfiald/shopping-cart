import { Github, LucideLinkedin } from "lucide-react";
import styles from "./footer.module.css";

function Footer() {
 return (
  <footer>
   <div className={styles["top-footer"]}>
    <div data-testid="about" className="content">
     <div className="title">Shoppers</div>
     <div className="about">About</div>
     <div className="career">Career</div>
     <div className="blog">Blog</div>
     <div className="sale">Sale</div>
    </div>
    <div data-testid="help" className="content">
     <div className="title">Guide and Help</div>
     <div className="about">Help</div>
     <div className="career">Terms and Condition</div>
     <div className="blog">Privacy</div>
     <div className="sale">Contact Us</div>
    </div>
    <div data-testid="socials-media" className="content">
     <div className="title">Follow</div>
     <a
      href="https://github.com/Delfiald"
      target="_blank"
      rel="noopener noreferrer"
     >
      <Github size={16} title="Github" />
     </a>
     <a
      href="https://linkedin.com/in/m-aldi-gunawan"
      target="_blank"
      rel="noopener noreferrer"
     >
      <LucideLinkedin size={16} title="Linkedin" />
     </a>
    </div>
    <div data-testid="apps" className="content">
     <div className="title">Download Apps</div>
     <div>
      <img src="/Stores/google-play.svg" alt="Google Play" />
      <p>GET IT ON</p>
      <p>Google Play</p>
     </div>
     <div>
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
  </footer>
 );
}

export default Footer;
