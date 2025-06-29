import styles from './loading.module.css';

const Loading = () => { 
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
}

export default Loading;