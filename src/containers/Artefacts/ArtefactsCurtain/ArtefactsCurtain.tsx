"use client";
import { useCallback, FC, useMemo, useEffect } from "react";
import { useEvent, useStore } from "effector-react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { $selectedArtefact, setSelectedArtefact } from "@/entities";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useKeyPress } from "@/shared";
import {
  $artefactInfo,
  $artefactInfoLoading,
  updateArtefactInfo,
} from "@/entities/artefactInfo";

export const ArtefactsCurtain: FC = () => {
  const selectedItem = useStore($selectedArtefact);
  const itemInfo = useStore($artefactInfo);
  const itemInfoLoading = useStore($artefactInfoLoading);
  const toggleCurtain = useEvent(setSelectedArtefact);
  const saveItemInfo = useEvent(updateArtefactInfo);

  const defaultValues = useMemo(
    () =>
      itemInfo && !itemInfoLoading
        ? itemInfo
        : {
            label: "",
            item_id: "",
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
          },
    [itemInfo, itemInfoLoading]
  );

  const form = useForm({ defaultValues });

  const { reset, formState, getValues } = form;
  const { isDirty, isValid } = formState;

  const handleSubmit = useCallback(() => {
    if (isDirty) {
      saveItemInfo(getValues());
    }
  }, [getValues, isDirty, saveItemInfo]);

  const handleReset = useCallback(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleCloseCurtain = useCallback(() => {
    if (!isDirty) {
      toggleCurtain(null);
    }
  }, [toggleCurtain, isDirty]);

  useEffect(handleReset, [handleReset]);

  useKeyPress("Enter", handleSubmit);
  useKeyPress("Escape", handleCloseCurtain);

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
              <Typography variant="h4">{itemInfo?.label}</Typography>
              <Typography>{itemInfo?.item_id}</Typography>
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
              Сохранить изменения
            </Button>
          </FormProvider>
        </Box>
      </Drawer>
    </div>
  );
};
