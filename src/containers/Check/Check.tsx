"use client";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import styles from "./check.module.scss";
import { CitiesSelect, ItemsSelect } from "@/components";
import { Button } from "@mui/material";
import { CustomTable } from "@/components";
import { useCallback, useState } from "react";
import { City, Data } from "@/shared";
import { CITIES } from "@/shared/constants";
import { Layout } from "@/containers/Layout";

export interface Inputs {
  items: City[];
  cities: City[];
}

const DEFAULT_VALUES = {
  items: [],
  cities: CITIES.filter((x) => x.id !== "Caerleon" && x.id !== "Lymhurst"),
};

export const Check = () => {
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
    return <div>Loading...</div>;
  }

  return (
    <Layout>
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
    </Layout>
  );
};
