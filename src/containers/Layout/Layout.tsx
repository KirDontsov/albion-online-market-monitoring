import { FC } from "react";
import { SharedProps } from "@/shared";
import Paper from "@mui/material/Paper";
import styles from "./layout.module.scss";
import Link from "next/link";

export const Layout: FC<SharedProps> = ({ children }) => {
  return (
    <Paper elevation={3}>
      <div className={styles.navBar}>
        <Link href="/monitoring">Monitoring</Link>
        <Link href="/artefacts">Artefacts</Link>
      </div>
      <main className={styles.mainWrap}>{children}</main>
    </Paper>
  );
};
