import { createGate } from "effector-react";
import { createEffect, createStore, forward, sample } from "effector";
import { getResources } from "@/shared/api";
import type { ExtendedData } from "@/components/CollapsibleTable/interfaces";

export const $resources = createStore<ExtendedData[] | null>([]);
export const $resourcesLoading = createStore<boolean>(false);

export const ResourcesGate = createGate("ResourcesGate");

export const fetchResourcesFx = createEffect(async () => {
  const data = await getResources();
  return data || [];
});

forward({
  from: ResourcesGate.open,
  to: fetchResourcesFx,
});

sample({
  clock: fetchResourcesFx.doneData,
  target: $resources,
});

sample({
  clock: fetchResourcesFx.pending,
  target: $resourcesLoading,
});
