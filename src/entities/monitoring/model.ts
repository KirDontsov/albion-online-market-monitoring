import { createGate } from "effector-react";
import { combine, createEffect, createStore, forward, sample } from "effector";
import { getItems, getArtefacts } from "@/shared/api";
import type { ExtendedData } from "@/components/CollapsibleTable/interfaces";
import { fetchResourcesFx, $resourcesMap } from "@/entities/resources/model";

const CITIES = ["thetford", "fort_sterling", "martlock", "brecilien"] as const;
const TAX_RATE = 10.5;

export const $items = createStore<ExtendedData[] | null>([]);
export const $itemsLoading = createStore<boolean>(false);

export const MonitoringGate = createGate("MonitoringGate");

export const fetchItemsFx = createEffect(async () => {
  const [items, artefacts] = await Promise.all([getItems(), getArtefacts()]);
  const artefactMap = new Map<string, ExtendedData>();
  artefacts?.forEach((a) => artefactMap.set(a.item_id, a));

  return (
    items?.map((item) => ({
      ...item,
      artefact: item.artefact_id ? artefactMap.get(item.artefact_id) ?? null : null,
    })) || []
  );
});

forward({
  from: MonitoringGate.open,
  to: fetchItemsFx,
});

forward({
  from: MonitoringGate.open,
  to: fetchResourcesFx,
});

sample({
  clock: fetchItemsFx.doneData,
  target: $items,
});

sample({
  clock: fetchItemsFx.pending,
  target: $itemsLoading,
});

function getCityCost(
  item: ExtendedData,
  city: (typeof CITIES)[number],
  resourcesMap: Map<string, ExtendedData>
): number {
  const artefactField = `sell_price_${city}` as keyof ExtendedData;
  const artefactCost = item.artefact
    ? Number((item.artefact as unknown as Record<string, unknown>)[artefactField]) || 0
    : 0;

  let resourceCost = 0;
  if (item.resources) {
    for (const r of item.resources) {
      const resData = resourcesMap.get(r.item_id);
      if (resData) {
        const price = Number(resData[`sell_price_${city}` as keyof ExtendedData]) || 0;
        resourceCost += price * Number(r.count);
      }
    }
  }

  return artefactCost + resourceCost;
}

function enrichItem(cur: ExtendedData, resourcesMap: Map<string, ExtendedData>) {
  const costs = CITIES.map((city) => ({
    city,
    total: getCityCost(cur, city, resourcesMap),
  }));

  const profitPerCity = costs.map(({ city, total }) => {
    const sell = Number(cur[`sell_price_${city}` as keyof ExtendedData]) || 0;
    const tax = Math.floor((sell / 100) * TAX_RATE);
    return { city, profit: Math.floor(sell - total - tax) };
  });

  const profits = profitPerCity.map((p) => p.profit);
  const maxProfit = Math.max(...profits);
  const maxPrice = Math.max(
    ...CITIES.map((city) => Number(cur[`sell_price_${city}` as keyof ExtendedData]) || 0)
  );

  return {
    ...cur,
    maxPrice: maxPrice.toString(),
    maxProfit: maxProfit.toString(),
    profit_thetford: profitPerCity.find((p) => p.city === "thetford")!.profit.toString(),
    profit_fort_sterling: profitPerCity.find((p) => p.city === "fort_sterling")!.profit.toString(),
    profit_martlock: profitPerCity.find((p) => p.city === "martlock")!.profit.toString(),
    profit_brecilien: profitPerCity.find((p) => p.city === "brecilien")!.profit.toString(),
    craft_price: costs.find((c) => c.city === "thetford")!.total.toString(),
  };
}

export const $allCraftItems = combine($items, $resourcesMap, (items, resourcesMap) =>
  items?.reduce((acc: ExtendedData[], cur) => {
    if (/OFF|2H|MAIN/.test(cur.item_id)) {
      acc.push(enrichItem(cur, resourcesMap));
    }
    return acc;
  }, [])
);
