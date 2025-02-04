import styles from "./feedback.module.css";

function Loading() {
 return (
  <section className={styles.loading}>
   <div className={styles["loading-wrapper"]}>
    <div className={styles["loading-container"]}>
     <p>Loading</p>
     <div className={styles.dots}>
      <div></div>
      <div></div>
      <div></div>
     </div>
    </div>
   </div>
  </section>
 );
}

export default Loading;
