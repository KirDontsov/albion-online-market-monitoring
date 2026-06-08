"use client";
import { FC, useCallback } from "react";
import { CollapsibleTable } from "@/components/CollapsibleTable";
import { MuiThemeProvider } from "@/context";
import Paper from "@mui/material/Paper";
import { useGate, useStore, useEvent } from "effector-react";
import { $resources, $resourcesLoading, ResourcesGate } from "@/entities";
import { setSelectedResource } from "@/entities/resourceInfo";
import styles from "./resources.module.scss";
import { Layout } from "@/containers/Layout";
import { ResourcesCurtain } from "./ResourcesCurtain";
import { Button } from "@mui/material";

export const Resources: FC = () => {
  const loading = useStore($resourcesLoading);
  const resources = useStore($resources);
  const toggleCurtain = useEvent(setSelectedResource);

  useGate(ResourcesGate);

  const handleAdd = useCallback(() => {
    toggleCurtain("__new__");
  }, [toggleCurtain]);

  if (loading) {
    return <div className={styles.loadingWrap}>loading...</div>;
  }

  return (
    <Layout>
      <MuiThemeProvider>
        <Paper className={styles.resourcesWrap}>
          <div>
            <Button variant="contained" onClick={handleAdd}>
              Добавить ресурс
            </Button>
            <h4>Ресурсы</h4>
            <CollapsibleTable data={resources ?? []} artefacts />
          </div>
        </Paper>
        <ResourcesCurtain />
      </MuiThemeProvider>
    </Layout>
  );
};
