import styles from './loading.module.css';

export const Loading = () => { 
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
}
