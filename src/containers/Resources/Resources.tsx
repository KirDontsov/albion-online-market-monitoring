"use client";
import { FC, useCallback, useMemo, useState } from "react";
import { CollapsibleTable } from "@/components/CollapsibleTable";
import { TierFilter } from "@/components/TierFilter";
import { MuiThemeProvider } from "@/context";
import Paper from "@mui/material/Paper";
import { useGate, useStore, useEvent } from "effector-react";
import { $resourcesLoading, ResourcesGate } from "@/entities";
import { $resourcesWithMinPrice } from "@/entities/resources/model";
import { setSelectedResource } from "@/entities/resourceInfo";
import styles from "./resources.module.scss";
import { Layout } from "@/containers/Layout";
import { ResourcesCurtain } from "./ResourcesCurtain";
import { SyncButton } from "@/components/SyncButton";
import { Button } from "@mui/material";
import { filterByTiers } from "@/shared";

export const Resources: FC = () => {
  const loading = useStore($resourcesLoading);
  const resources = useStore($resourcesWithMinPrice);
  const toggleCurtain = useEvent(setSelectedResource);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);

  useGate(ResourcesGate);

  const handleAdd = useCallback(() => {
    toggleCurtain("__new__");
  }, [toggleCurtain]);

  const filtered = useMemo(
    () => filterByTiers(resources ?? [], selectedTiers),
    [resources, selectedTiers]
  );

  if (loading) {
    return <div className={styles.loadingWrap}>loading...</div>;
  }

  return (
    <Layout>
      <MuiThemeProvider>
        <Paper className={styles.resourcesWrap}>
          <div className={styles.toolbar}>
            <Button variant="contained" onClick={handleAdd} sx={{ flexShrink: 0 }}>
              Добавить ресурс
            </Button>
            <TierFilter value={selectedTiers} onChange={setSelectedTiers} />
            <SyncButton />
          </div>
          <div>
            <h4>Ресурсы</h4>
            <CollapsibleTable data={filtered} artefacts />
          </div>
        </Paper>
        <ResourcesCurtain />
      </MuiThemeProvider>
    </Layout>
  );
};
