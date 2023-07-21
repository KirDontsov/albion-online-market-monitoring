import styles from "./page.module.scss";
import { Check } from "@/containers";

export default function Page() {
  return (
    <main className={styles.main}>
      <Check />
    </main>
  );
}
