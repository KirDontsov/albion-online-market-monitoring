"use client";
import { FC, useCallback } from "react";
import { CollapsibleTable } from "@/components/CollapsibleTable";
import { MuiThemeProvider } from "@/context";
import Paper from "@mui/material/Paper";
import { useGate, useStore, useEvent } from "effector-react";
import { $artefactItems, $artefactsLoading, ArtefactsGate, setSelectedArtefact } from "@/entities";
import styles from "./artefacts.module.scss";
import { ArtefactsCurtain } from "./ArtefactsCurtain";
import { Layout } from "@/containers/Layout";
import { Button } from "@mui/material";

export const Artefacts: FC = () => {
  const loading = useStore($artefactsLoading);
  const artefactItems = useStore($artefactItems);
  const toggleCurtain = useEvent(setSelectedArtefact);

  useGate(ArtefactsGate);

  const handleAdd = useCallback(() => {
    toggleCurtain("__new__");
  }, [toggleCurtain]);

  if (loading) {
    return <div className={styles.loadingWrap}>loading...</div>;
  }

  return (
    <Layout>
      <MuiThemeProvider>
        <Paper className={styles.artefactsWrap}>
          <div>
            <Button variant="contained" onClick={handleAdd}>
              Добавить артефакт
            </Button>
            <h4>Закупки</h4>
            <CollapsibleTable data={artefactItems ?? []} artefacts />
          </div>
        </Paper>
        <ArtefactsCurtain />
      </MuiThemeProvider>
    </Layout>
  );
};
