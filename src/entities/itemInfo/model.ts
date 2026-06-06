import { createEffect, createEvent, createStore, sample } from "effector";
import { ExtendedData } from "@/components/CollapsibleTable/interfaces";
import { getItem, updateItem, createItem } from "@/shared/api";
import { $selectedItem, fetchItemsFx, setSelectedItem } from "@/entities";

export const $itemInfo = createStore<ExtendedData | null>(null);
export const $itemInfoLoading = createStore<boolean>(false);

const NEW_ITEM_ID = "__new__";

export const fetchItemFx = createEffect(async (id: string | null) => {
  const data = await getItem(id);
  return data;
});

sample({
  source: $selectedItem,
  filter: (s) => s !== null && s !== NEW_ITEM_ID,
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

export const createItemFx = createEffect(async (item: ExtendedData) => {
  const data = await createItem(item);
  return data;
});
export const createNewItem = createEvent<ExtendedData>();

sample({
  clock: createNewItem,
  target: createItemFx,
});

sample({
  clock: createItemFx.doneData,
  target: fetchItemsFx,
});

sample({
  clock: createItemFx.doneData,
  fn: () => null,
  target: setSelectedItem,
});
