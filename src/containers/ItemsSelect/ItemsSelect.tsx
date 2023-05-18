"use client";
import type { FC } from "react";
import { ITEMS } from "@/shared/constants";
import { FormComboBox } from "@/components";
import styles from "./items-select.module.scss";

export interface ItemsSelectProps<V> {
  onSelect?: (cities: V[]) => void;
}

export const ItemsSelect: FC<ItemsSelectProps<any>> = () => (
  <div className={styles.itemsSelect}>
    <FormComboBox multi name="items" label="Товар" options={ITEMS} />
  </div>
);
