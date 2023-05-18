"use client";
import styles from "./page.module.scss";
import { CustomTable } from "@/components";
import { Button } from "@mui/material";
import type { Data } from "@/shared";
import { CitiesSelect, ItemsSelect } from "@/containers";
import { City } from "@/shared";
import { CITIES, ITEMS } from "@/shared/constants";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";

export interface Inputs {
  items: City[];
  cities: City[];
}

const DEFAULT_VALUES = {
  items: [],
  cities: CITIES.filter((x) => x.id !== "Caerleon" && x.id !== "Lymhurst"),
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data[]>([]);

  const getData = async (items: City[], cities: City[]): Promise<Data[]> => {
    const citiesIds = cities?.map((x) => x.id).join(",");
    const itemsIds = items?.map((x) => x.id).join(",");
    try {
      setLoading(true);
      const res = await fetch(
        `https://east.albion-online-data.com/api/v2/stats/prices/${itemsIds}.json?locations=${citiesIds}`
      );
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
    getData([ITEMS[0]], [CITIES[0]]).then((response) => {
      setData(response);
    });
  }, []);

  const form = useForm<Inputs>({ defaultValues: DEFAULT_VALUES });

  const { handleSubmit, formState } = form;
  const { isDirty, isValid } = formState;

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ items, cities }) => {
      getData(items, cities).then((data) => {
        setData(data);
      });
    },
    []
  );

  if (loading) {
    return "Loading...";
  }

  console.log(data);

  return (
    <main className={styles.main}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.header}>
            <CitiesSelect />
            <ItemsSelect />
            <div className={styles.bottom}>
              <Button
                type="submit"
                variant="contained"
                disabled={!isDirty || !isValid}
              >
                Проверить цены
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>

      {data && <CustomTable data={data} />}
    </main>
  );
}
