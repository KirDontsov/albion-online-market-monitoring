"use client";
import { FC, useMemo } from "react";
import { MuiThemeProvider } from "@/context";
import Paper from "@mui/material/Paper";
import styles from "./items.module.scss";
import { Layout } from "@/containers/Layout";
import { ITEMS } from "@/shared/constants";
import { CollapsibleTable } from "@/components/CollapsibleTable";
import { ExtendedData } from "@/components/CollapsibleTable/interfaces";

export const Items: FC = () => {
  const data = useMemo<ExtendedData[]>(
    () =>
      ITEMS.map((item) => ({
        label: item.label,
        item_id: item.id,
        craft_price: "",
        enchantment_price: "",
        artefact_id: "",
        sell_price_fort_sterling: "",
        sell_price_martlock: "",
        sell_price_thetford: "",
        sell_price_brecilien: "",
        buy_price_fort_sterling: "",
        buy_price_martlock: "",
        buy_price_thetford: "",
        buy_price_brecilien: "",
        orders_fort_sterling: "",
        orders_martlock: "",
        orders_thetford: "",
        orders_brecilien: "",
        created_at: "",
        updated_at: "",
        source: "api",
      })),
    []
  );

  return (
    <Layout>
      <MuiThemeProvider>
        <Paper className={styles.tableWrap}>
          <CollapsibleTable data={data} expandable={false} simple />
        </Paper>
      </MuiThemeProvider>
    </Layout>
  );
};
