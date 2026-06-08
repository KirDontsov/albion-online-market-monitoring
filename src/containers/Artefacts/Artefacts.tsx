"use client";
import { FC, useCallback, useMemo, useState } from "react";
import { CollapsibleTable } from "@/components/CollapsibleTable";
import { TierFilter } from "@/components/TierFilter";
import { MuiThemeProvider } from "@/context";
import Paper from "@mui/material/Paper";
import { useGate, useStore, useEvent } from "effector-react";
import { $artefactItems, $artefactsLoading, ArtefactsGate, setSelectedArtefact } from "@/entities";
import styles from "./artefacts.module.scss";
import { ArtefactsCurtain } from "./ArtefactsCurtain";
import { Layout } from "@/containers/Layout";
import { SyncButton } from "@/components/SyncButton";
import { Button } from "@mui/material";
import { filterByTiers } from "@/shared";

export const Artefacts: FC = () => {
  const loading = useStore($artefactsLoading);
  const artefactItems = useStore($artefactItems);
  const toggleCurtain = useEvent(setSelectedArtefact);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);

  useGate(ArtefactsGate);

  const handleAdd = useCallback(() => {
    toggleCurtain("__new__");
  }, [toggleCurtain]);

  const filtered = useMemo(
    () => filterByTiers(artefactItems ?? [], selectedTiers),
    [artefactItems, selectedTiers]
  );

  if (loading) {
    return <div className={styles.loadingWrap}>loading...</div>;
  }

  return (
    <Layout>
      <MuiThemeProvider>
        <Paper className={styles.artefactsWrap}>
          <div className={styles.toolbar}>
            <Button variant="contained" onClick={handleAdd} sx={{ flexShrink: 0 }}>
              Добавить артефакт
            </Button>
            <TierFilter value={selectedTiers} onChange={setSelectedTiers} />
            <SyncButton />
          </div>
          <div>
            <h4>Закупки</h4>
            <CollapsibleTable data={filtered} artefacts />
          </div>
        </Paper>
        <ArtefactsCurtain />
      </MuiThemeProvider>
    </Layout>
  );
};
