"use client";
import { FC, useCallback } from "react";
import { CollapsibleTable } from "@/components/CollapsibleTable";
import { MuiThemeProvider } from "@/context";
import styles from "./monitoring.module.scss";
import Paper from "@mui/material/Paper";
import { ItemsCurtain } from "@/components";
import { useGate, useStore, useEvent } from "effector-react";
import {
  $itemsLoading,
  $martlockCraftItems,
  $otherItems,
  MonitoringGate,
  setSelectedItem,
} from "@/entities";
import { Button } from "@mui/material";
import { Layout } from "@/containers/Layout";

export const Monitoring: FC = () => {
  const loading = useStore($itemsLoading);
  const martlockCraftItems = useStore($martlockCraftItems);
  const otherItems = useStore($otherItems);
  const toggleCurtain = useEvent(setSelectedItem);

  useGate(MonitoringGate);

  const handleAdd = useCallback(() => {
    toggleCurtain("__new__");
  }, [toggleCurtain]);

  if (loading) {
    return <div className={styles.loadingWrap}>loading...</div>;
  }

  return (
    <Layout>
      <MuiThemeProvider>
        <Paper className={styles.monitoringWrap}>
          <div>
            <Button variant="contained" onClick={handleAdd}>
              Добавить предмет
            </Button>
          </div>
          <div className={styles.tablesWrap}>
            <div>
              <h4>Martlock</h4>
              <CollapsibleTable data={martlockCraftItems ?? []} />
            </div>
            <div>
              <h4>Other</h4>
              <CollapsibleTable data={otherItems ?? []} />
            </div>
          </div>
        </Paper>
        <ItemsCurtain />
      </MuiThemeProvider>
    </Layout>
  );
};
