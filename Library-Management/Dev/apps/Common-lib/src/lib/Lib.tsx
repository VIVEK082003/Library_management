import styles from './Lib.module.css';

/* eslint-disable-next-line */
export interface LibProps {}

export function Lib(props: LibProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Lib!</h1>
    </div>
  );
}

export default Lib;
