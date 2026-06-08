"use client";

import { FC } from "react";
import { SharedProps } from "@/shared";
import Paper from "@mui/material/Paper";
import styles from "./layout.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import cn from "classnames";

export const Layout: FC<SharedProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <Paper elevation={3}>
      <div className={styles.navBar}>
        <Link
          href="/monitoring"
          className={cn({ [styles.activeLink]: pathname === "/monitoring" })}
        >
          Monitoring
        </Link>
        <Link
          href="/artefacts"
          className={cn({ [styles.activeLink]: pathname === "/artefacts" })}
        >
          Artefacts
        </Link>
        <Link
          href="/resources"
          className={cn({ [styles.activeLink]: pathname === "/resources" })}
        >
          Resources
        </Link>
        <Link
          href="/items"
          className={cn({ [styles.activeLink]: pathname === "/items" })}
        >
          Items
        </Link>
      </div>
      <main className={styles.mainWrap}>{children}</main>
    </Paper>
  );
};
