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
  $allCraftItems,
  MonitoringGate,
  setSelectedItem,
} from "@/entities";
import { Button } from "@mui/material";
import { Layout } from "@/containers/Layout";
import { filterByTiers } from "@/shared";

export const Monitoring: FC = () => {
  const loading = useStore($itemsLoading);
  const allCraftItems = useStore($allCraftItems);
  const toggleCurtain = useEvent(setSelectedItem);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);

  useGate(MonitoringGate);

  const handleAdd = useCallback(() => {
    toggleCurtain("__new__");
  }, [toggleCurtain]);

  const filteredItems = useMemo(
    () => filterByTiers(allCraftItems ?? [], selectedTiers),
    [allCraftItems, selectedTiers]
  );

  const filteredItemIds = useMemo(
    () => filteredItems.map((i) => i.item_id),
    [filteredItems]
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
            <SyncButton itemIds={filteredItemIds} />
          </div>
          <div>
            <CollapsibleTable data={filteredItems} />
          </div>
        </Paper>
        <ItemsCurtain />
      </MuiThemeProvider>
    </Layout>
  );
};
