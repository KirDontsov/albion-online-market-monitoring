"use client";
import { FormComboBox } from "@/components";
import { FC } from "react";
import { City } from "@/shared";
import { CITIES } from "@/shared/constants";
import styles from "./cities-select.module.scss";

export interface CitiesSelectProps {
  onSelect?: (cities: City[]) => void;
}
export const CitiesSelect: FC<CitiesSelectProps> = () => (
  <div className={styles.citiesSelect}>
    <FormComboBox multi name="cities" label="Город" options={CITIES} />
  </div>
);
