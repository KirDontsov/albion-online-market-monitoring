import { createEffect, createEvent, createStore, sample } from "effector";
import { ExtendedData } from "@/components/CollapsibleTable/interfaces";
import { getItem, updateItem } from "@/shared/api";
import { $selectedItem, fetchItemsFx, setSelectedItem } from "@/entities";

export const $itemInfo = createStore<ExtendedData | null>(null);
export const $itemInfoLoading = createStore<boolean>(false);

export const fetchItemFx = createEffect(async (id: string | null) => {
  const data = await getItem(id);
  return data;
});

sample({
  source: $selectedItem,
  filter: (s) => s !== null,
  target: fetchItemFx,
});

sample({
  clock: fetchItemFx.doneData,
  target: $itemInfo,
});

sample({
  clock: fetchItemFx.pending,
  target: $itemInfoLoading,
});

export const updateItemFx = createEffect(async (item: ExtendedData | null) => {
  const data = await updateItem(item);
  return data;
});
export const updateItemInfo = createEvent<ExtendedData>();

sample({
  clock: updateItemInfo,
  target: updateItemFx,
});

sample({
  clock: updateItemFx.doneData,
  target: fetchItemsFx,
});

sample({
  clock: updateItemFx.doneData,
  fn: () => null,
  target: setSelectedItem,
});
