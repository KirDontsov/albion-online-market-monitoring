"use client";
import { useEffect, useMemo, useState } from "react";
import { CollapsibleTable } from "@/components/CollapsibleTable";
import { ExtendedData } from "@/components/CollapsibleTable/interfaces";
import { MuiThemeProvider } from "@/context";
import styles from "./monitoring.module.scss";
import Paper from "@mui/material/Paper";

export const Monitoring = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExtendedData[]>([]);
  const getData = async (): Promise<ExtendedData[]> => {
    try {
      setLoading(true);
      const res = await fetch(`http://127.0.0.1:8080/api/items`);
      if (!res.ok) {
        console.warn("Failed to fetch data");
      }
      setLoading(false);
      return res.json();
    } catch (e) {
      // @ts-ignore
      throw new Error(e?.message || e);
    }
  };

  useEffect(() => {
    getData().then((data) => {
      setData(data);
    });
  }, []);

  const { martlockCraftItems, otherItems } = useMemo(() => {
    const martlockCraftItems = data.reduce((acc: ExtendedData[], cur) => {
      if (/OFF/.test(cur.item_id) && !/ARTEFACT/.test(cur.item_id)) {
        acc.push({
          ...cur,
          maxPrice: Math.max(
            ...[
              Number(cur.sell_price_thetford),
              Number(cur.sell_price_fort_sterling),
              Number(cur.sell_price_martlock),
            ]
          ).toString(),
        });
      }
      return acc;
    }, []);

    const otherItems = data.reduce((acc: ExtendedData[], cur) => {
      if (/T4_2H|T4_MAIN/.test(cur.item_id) && !/ARTEFACT/.test(cur.item_id)) {
        acc.push({
          ...cur,
          maxPrice: Math.max(
            ...[
              Number(cur.sell_price_thetford),
              Number(cur.sell_price_fort_sterling),
              Number(cur.sell_price_martlock),
            ]
          ).toString(),
        });
      }
      return acc;
    }, []);

    return {
      martlockCraftItems,
      otherItems,
    };
  }, [data]);

  if (loading) {
    return <>loading...</>;
  }

  return (
    <MuiThemeProvider>
      <Paper className={styles.monitoringWrap}>
        <h2>Martlock</h2>
        <CollapsibleTable data={martlockCraftItems} />
        <h2>Other</h2>
        <CollapsibleTable data={otherItems} />
      </Paper>
    </MuiThemeProvider>
  );
};
