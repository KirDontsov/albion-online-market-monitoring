"use client";
import { FC } from "react";
import { CollapsibleTable } from "@/components/CollapsibleTable";
import { MuiThemeProvider } from "@/context";
import styles from "./monitoring.module.scss";
import Paper from "@mui/material/Paper";
import { ItemsCurtain } from "@/components";
import { useGate, useStore } from "effector-react";
import {
  $itemsLoading,
  $martlockCraftItems,
  $otherItems,
  MonitoringGate,
} from "@/entities";

export const Monitoring: FC = () => {
  const loading = useStore($itemsLoading);
  const martlockCraftItems = useStore($martlockCraftItems);
  const otherItems = useStore($otherItems);

  useGate(MonitoringGate);

  if (loading) {
    return <div className={styles.loadingWrap}>loading...</div>;
  }

  return (
    <MuiThemeProvider>
      <Paper className={styles.monitoringWrap}>
        <div>
          <h4>Martlock</h4>
          <CollapsibleTable data={martlockCraftItems ?? []} />
        </div>
        <div>
          <h4>Other</h4>
          <CollapsibleTable data={otherItems ?? []} />
        </div>
      </Paper>
      <ItemsCurtain />
    </MuiThemeProvider>
  );
};
