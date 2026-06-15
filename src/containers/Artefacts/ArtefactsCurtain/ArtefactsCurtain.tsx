"use client";
import { useCallback, FC, useMemo, useEffect } from "react";
import { useEvent, useStore } from "effector-react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import {
  $selectedArtefact,
  setSelectedArtefact,
  $artefactInfo,
  $artefactInfoLoading,
  updateArtefactInfo,
  createNewArtefact,
} from "@/entities";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useKeyPress, saveScrollPosition } from "@/shared";
import { ExtendedData } from "@/components/CollapsibleTable/interfaces";

const NEW_ARTEFACT_ID = "__new__";

const DEFAULT_VALUES: ExtendedData = {
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
  comment: "",
  popularity: "0",
};

export const ArtefactsCurtain: FC = () => {
  const selectedItem = useStore($selectedArtefact);
  const itemInfo = useStore($artefactInfo);
  const itemInfoLoading = useStore($artefactInfoLoading);
  const toggleCurtain = useEvent(setSelectedArtefact);
  const saveItemInfo = useEvent(updateArtefactInfo);
  const createItem = useEvent(createNewArtefact);

  const isNew = selectedItem === NEW_ARTEFACT_ID;

  const defaultValues = useMemo(() => {
    if (isNew) return DEFAULT_VALUES;
    return itemInfo && !itemInfoLoading ? itemInfo : DEFAULT_VALUES;
  }, [itemInfo, itemInfoLoading, isNew]);

  const form = useForm<ExtendedData>({ defaultValues });

  const { reset, formState, getValues } = form;
  const { isDirty, isValid } = formState;

  const handleSubmit = useCallback(() => {
    saveScrollPosition();
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
                  <Typography variant="h5">Новый артефакт</Typography>
                  <FormInput name="item_id" label="ID артефакта" required />
                  <FormInput name="label" label="Название" required />
                  <FormInput name="crafted_item_id" label="ID крафт-предмета" />
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
                autoFocus
                numeric
              />
              <FormInput
                name="sell_price_fort_sterling"
                label="Цена Fort Sterling"
                required
                numeric
              />
              <FormInput
                name="sell_price_martlock"
                label="Цена Martlock"
                required
                numeric
              />
              <FormInput
                name="sell_price_brecilien"
                label="Цена Brecilien"
                required
                numeric
              />
              <FormInput
                name="orders_thetford"
                label="Заказы Thetford"
                required
                numeric
              />
              <FormInput
                name="orders_fort_sterling"
                label="Заказы Fort Sterling"
                required
                numeric
              />
              <FormInput
                name="orders_martlock"
                label="Заказы Martlock"
                required
                numeric
              />
              <FormInput
                name="orders_brecilien"
                label="Заказы Brecilien"
                required
                numeric
              />
              <FormInput
                name="popularity"
                label="Популярность (0–5)"
                numeric
              />
              <FormInput
                name="comment"
                label="Комментарий"
                multi
              />
            </Stack>
            <Button
              type="submit"
              variant="contained"
              disabled={!isDirty || !isValid}
              onClick={handleSubmit}
            >
              {isNew ? "Создать артефакт" : "Сохранить изменения"}
            </Button>
          </FormProvider>
        </Box>
      </Drawer>
    </div>
  );
};
