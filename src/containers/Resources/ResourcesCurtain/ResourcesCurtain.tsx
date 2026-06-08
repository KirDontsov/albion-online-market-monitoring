"use client";
import { useCallback, FC, useMemo, useEffect } from "react";
import { useEvent, useStore } from "effector-react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import {
  $selectedResource,
  setSelectedResource,
  $resourceInfo,
  $resourceInfoLoading,
  updateResourceInfo,
  createNewResource,
} from "@/entities/resourceInfo";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useKeyPress } from "@/shared";
import { ExtendedData } from "@/components/CollapsibleTable/interfaces";

const NEW_RESOURCE_ID = "__new__";

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
};

export const ResourcesCurtain: FC = () => {
  const selectedResource = useStore($selectedResource);
  const resourceInfo = useStore($resourceInfo);
  const resourceInfoLoading = useStore($resourceInfoLoading);
  const toggleCurtain = useEvent(setSelectedResource);
  const saveResourceInfo = useEvent(updateResourceInfo);
  const createResource = useEvent(createNewResource);

  const isNew = selectedResource === NEW_RESOURCE_ID;

  const defaultValues = useMemo(() => {
    if (isNew) return DEFAULT_VALUES;
    return resourceInfo && !resourceInfoLoading ? resourceInfo : DEFAULT_VALUES;
  }, [resourceInfo, resourceInfoLoading, isNew]);

  const form = useForm<ExtendedData>({ defaultValues });

  const { reset, formState, getValues } = form;
  const { isDirty, isValid } = formState;

  const handleSubmit = useCallback(() => {
    const values = getValues();
    const now = new Date().toISOString();
    if (isNew) {
      createResource({ ...values, created_at: now, updated_at: now });
    } else if (isDirty) {
      saveResourceInfo({ ...values, updated_at: now });
    }
  }, [getValues, isDirty, saveResourceInfo, createResource, isNew]);

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

  if (resourceInfoLoading) {
    return <>Loading...</>;
  }

  return (
    <div>
      <Drawer
        anchor={"right"}
        open={selectedResource !== null}
        onClose={handleCloseCurtain}
      >
        <Box sx={{ width: 550, padding: "24px" }}>
          <FormProvider {...form}>
            <Stack spacing={2} paddingBottom={2}>
              {isNew && (
                <>
                  <Typography variant="h5">Новый ресурс</Typography>
                  <FormInput name="item_id" label="ID ресурса" required />
                  <FormInput name="label" label="Название" required />
                  <FormInput name="craft_price" label="Цена крафта" />
                </>
              )}
              {!isNew && (
                <>
                  <Typography variant="h4">{resourceInfo?.label}</Typography>
                  <Typography>{resourceInfo?.item_id}</Typography>
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
              {isNew ? "Создать ресурс" : "Сохранить изменения"}
            </Button>
          </FormProvider>
        </Box>
      </Drawer>
    </div>
  );
};
