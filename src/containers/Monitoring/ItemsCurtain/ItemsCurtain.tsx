"use client";
import { useCallback, FC, useMemo, useEffect } from "react";
import { useEvent, useStore } from "effector-react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import {
  $selectedItem,
  setSelectedItem,
  $itemInfo,
  $itemInfoLoading,
  updateItemInfo,
  createNewItem,
} from "@/entities";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useKeyPress } from "@/shared";
import { ExtendedData } from "@/components/CollapsibleTable/interfaces";

const NEW_ITEM_ID = "__new__";

export const DEFAULT_VALUES: ExtendedData = {
  label: "",
  item_id: "",
  craft_price: "",
  artefact_id: "",
  enchantment_price: "",
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
  maxPrice: "",
  maxProfit: "",
  source: "api",
};

export const ItemsCurtain: FC = () => {
  const selectedItem = useStore($selectedItem);
  const itemInfo = useStore($itemInfo);
  const itemInfoLoading = useStore($itemInfoLoading);
  const toggleCurtain = useEvent(setSelectedItem);
  const saveItemInfo = useEvent(updateItemInfo);
  const createItem = useEvent(createNewItem);

  const isNew = selectedItem === NEW_ITEM_ID;

  const defaultValues = useMemo(() => {
    if (isNew) return DEFAULT_VALUES;
    // нельзя слать на бэк artefact
    const { artefact, ...itemWithoutArtefact } = itemInfo ?? { artefact: {} };
    return itemWithoutArtefact && !itemInfoLoading
      ? itemWithoutArtefact
      : DEFAULT_VALUES;
  }, [itemInfo, itemInfoLoading, isNew]);

  const form = useForm<ExtendedData>({ defaultValues });

  const { reset, formState, getValues } = form;
  const { isDirty, isValid } = formState;

  const handleSubmit = useCallback(() => {
    const values = getValues();
    const now = Math.floor(Date.now() / 1000).toString();
    if (isNew) {
      createItem({ ...values, created_at: now, updated_at: now });
    } else {
      saveItemInfo({ ...values, updated_at: now });
    }
  }, [getValues, saveItemInfo, createItem, isNew]);

  const handleReset = useCallback(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleCloseCurtain = useCallback(() => {
    toggleCurtain(null);
  }, [toggleCurtain]);

  const handleEscapeCurtain = useCallback(() => {
    if (!isDirty) {
      toggleCurtain(null);
    }
  }, [toggleCurtain, isDirty]);

  useEffect(handleReset, [handleReset]);

  useKeyPress("Enter", handleSubmit);
  useKeyPress("Escape", handleEscapeCurtain);

  if (itemInfoLoading) {
    return <>Loading...</>;
  }

  return (
    <div>
      <Drawer
        anchor={"right"}
        open={selectedItem !== null}
        onClose={handleCloseCurtain}
      >
        <Box sx={{ width: 550, padding: "24px" }}>
          <FormProvider {...form}>
            <Stack spacing={2} paddingBottom={2}>
              {isNew && (
                <>
                  <Typography variant="h5">Новый предмет</Typography>
                  <FormInput name="item_id" label="ID предмета" required />
                  <FormInput name="label" label="Название" required />
                  <FormInput name="craft_price" label="Цена крафта" />
                  <FormInput name="enchantment_price" label="Цена зачарования" />
                  <FormInput name="artefact_id" label="ID артефакта" />
                </>
              )}
              {!isNew && (
                <>
                  <Typography variant="h4">{itemInfo?.label}</Typography>
                  <Typography>{itemInfo?.item_id}</Typography>
                </>
              )}
              <FormInput
                name="sell_price_thetford"
                label="Цена Thetford"
                required
              />
              <FormInput
                name="sell_price_fort_sterling"
                label="Цена Fort Sterling"
                required
              />
              <FormInput
                name="sell_price_martlock"
                label="Цена Martlock"
                required
              />
              <FormInput
                name="sell_price_brecilien"
                label="Цена Brecilien"
                required
              />
              <FormInput
                name="orders_thetford"
                label="Заказы Thetford"
                required
              />
              <FormInput
                name="orders_fort_sterling"
                label="Заказы Fort Sterling"
                required
              />
              <FormInput
                name="orders_martlock"
                label="Заказы Martlock"
                required
              />
              <FormInput
                name="orders_brecilien"
                label="Заказы Brecilien"
                required
              />
            </Stack>
            <Button
              type="submit"
              variant="contained"
              disabled={!isDirty || !isValid}
              onClick={handleSubmit}
            >
              {isNew ? "Создать предмет" : "Сохранить изменения"}
            </Button>
          </FormProvider>
        </Box>
      </Drawer>
    </div>
  );
};
