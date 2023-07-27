"use client";
import { FC } from "react";
import { CollapsibleTable } from "@/components/CollapsibleTable";
import { MuiThemeProvider } from "@/context";
import Paper from "@mui/material/Paper";
import { useGate, useStore } from "effector-react";
import { $artefactItems, $artefactsLoading, ArtefactsGate } from "@/entities";
import styles from "./artefacts.module.scss";
import { ArtefactsCurtain } from "./ArtefactsCurtain";

export const Artefacts: FC = () => {
  const loading = useStore($artefactsLoading);
  const artefactItems = useStore($artefactItems);

  useGate(ArtefactsGate);

  if (loading) {
    return <div className={styles.loadingWrap}>loading...</div>;
  }

  return (
    <MuiThemeProvider>
      <Paper className={styles.artefactsWrap}>
        <div>
          <h4>Закупки</h4>
          <CollapsibleTable data={artefactItems ?? []} artefacts />
        </div>
      </Paper>
      <ArtefactsCurtain />
    </MuiThemeProvider>
  );
};
