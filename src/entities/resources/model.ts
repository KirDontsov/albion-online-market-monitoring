import { createGate } from "effector-react";
import { combine, createEffect, createStore, forward, sample } from "effector";
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

export const $resourcesWithMinPrice = combine($resources, (resources) =>
  resources?.map((r) => {
    const prices = [
      Number(r.sell_price_thetford),
      Number(r.sell_price_fort_sterling),
      Number(r.sell_price_martlock),
      Number(r.sell_price_brecilien),
    ].filter((p) => p > 0);

    const minPrice = prices.length > 0 ? Math.min(...prices).toString() : "";

    return {
      ...r,
      minPrice,
    };
  }) ?? []
);
