"use client";
import { FC } from "react";
import { CollapsibleTable } from "@/components/CollapsibleTable";
import { MuiThemeProvider } from "@/context";
import Paper from "@mui/material/Paper";
import { useGate, useStore } from "effector-react";
import { $resources, $resourcesLoading, ResourcesGate } from "@/entities";
import styles from "./resources.module.scss";
import { Layout } from "@/containers/Layout";

export const Resources: FC = () => {
  const loading = useStore($resourcesLoading);
  const resources = useStore($resources);

  useGate(ResourcesGate);

  if (loading) {
    return <div className={styles.loadingWrap}>loading...</div>;
  }

  return (
    <Layout>
      <MuiThemeProvider>
        <Paper className={styles.resourcesWrap}>
          <div>
            <h4>Ресурсы</h4>
            <CollapsibleTable data={resources ?? []} artefacts />
          </div>
        </Paper>
      </MuiThemeProvider>
    </Layout>
  );
};
