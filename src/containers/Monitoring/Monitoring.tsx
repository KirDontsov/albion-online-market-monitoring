"use client";
import { FC, useCallback, useMemo, useState } from "react";
import { CollapsibleTable } from "@/components/CollapsibleTable";
import { TierFilter } from "@/components/TierFilter";
import { MuiThemeProvider } from "@/context";
import styles from "./monitoring.module.scss";
import Paper from "@mui/material/Paper";
import { ItemsCurtain } from "@/components";
import { SyncButton } from "@/components/SyncButton";
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
import { filterByTiers } from "@/shared";

export const Monitoring: FC = () => {
  const loading = useStore($itemsLoading);
  const martlockCraftItems = useStore($martlockCraftItems);
  const otherItems = useStore($otherItems);
  const toggleCurtain = useEvent(setSelectedItem);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);

  useGate(MonitoringGate);

  const handleAdd = useCallback(() => {
    toggleCurtain("__new__");
  }, [toggleCurtain]);

  const filteredMartlock = useMemo(
    () => filterByTiers(martlockCraftItems ?? [], selectedTiers),
    [martlockCraftItems, selectedTiers]
  );
  const filteredOther = useMemo(
    () => filterByTiers(otherItems ?? [], selectedTiers),
    [otherItems, selectedTiers]
  );

  if (loading) {
    return <div className={styles.loadingWrap}>loading...</div>;
  }

  return (
    <Layout>
      <MuiThemeProvider>
        <Paper className={styles.monitoringWrap}>
          <div className={styles.toolbar}>
            <Button variant="contained" onClick={handleAdd} sx={{ flexShrink: 0 }}>
              Добавить предмет
            </Button>
            <TierFilter value={selectedTiers} onChange={setSelectedTiers} />
            <SyncButton />
          </div>
          <div className={styles.tablesWrap}>
            <div>
              <h4>Martlock</h4>
              <CollapsibleTable data={filteredMartlock} />
            </div>
            <div>
              <h4>Other</h4>
              <CollapsibleTable data={filteredOther} />
            </div>
          </div>
        </Paper>
        <ItemsCurtain />
      </MuiThemeProvider>
    </Layout>
  );
};
