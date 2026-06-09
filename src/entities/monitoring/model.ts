import { createGate } from "effector-react";
import { combine, createEffect, createStore, forward, sample } from "effector";
import { getItems, getArtefacts } from "@/shared/api";
import type { ExtendedData } from "@/components/CollapsibleTable/interfaces";
import { fetchResourcesFx } from "@/entities/resources/model";

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

function enrichItem(cur: ExtendedData) {
  const artefactPrice = cur.artefact
    ? [
        Number(cur.artefact.sell_price_thetford),
        Number(cur.artefact.sell_price_fort_sterling),
        Number(cur.artefact.sell_price_martlock),
      ].reduce((acc, next) => acc + next, 0) / 3
    : 0;
  const craftPrice = Math.floor(
    artefactPrice + Number(cur.craft_price)
  ).toString();
  return {
    ...cur,
    maxPrice: Math.max(
      ...[
        Number(cur.sell_price_thetford),
        Number(cur.sell_price_fort_sterling),
        Number(cur.sell_price_martlock),
      ]
    ).toString(),
    maxProfit: !/@/.test(cur.item_id)
      ? Math.max(
          ...[
            Math.floor(
              Number(cur.sell_price_thetford) -
                Number(craftPrice) -
                (Number(cur.sell_price_thetford) / 100) * 10.5
            ),
            Math.floor(
              Number(cur.sell_price_fort_sterling) -
                Number(craftPrice) -
                (Number(cur.sell_price_fort_sterling) / 100) * 10.5
            ),
            Math.floor(
              Number(cur.sell_price_martlock) -
                Number(craftPrice) -
                (Number(cur.sell_price_martlock) / 100) * 10.5
            ),
          ]
        ).toString()
      : Math.max(
          ...[
            Math.floor(
              Number(cur.sell_price_thetford) -
                Number(cur.enchantment_price) -
                (Number(cur.sell_price_thetford) / 100) * 10.5
            ),
            Math.floor(
              Number(cur.sell_price_fort_sterling) -
                Number(cur.enchantment_price) -
                (Number(cur.sell_price_fort_sterling) / 100) * 10.5
            ),
            Math.floor(
              Number(cur.sell_price_martlock) -
                Number(cur.enchantment_price) -
                (Number(cur.sell_price_martlock) / 100) * 10.5
            ),
          ]
        ).toString(),
    craft_price: craftPrice,
  };
}

export const $allCraftItems = combine($items, (items) =>
  items?.reduce((acc: ExtendedData[], cur) => {
    if (/OFF|2H|MAIN/.test(cur.item_id)) {
      acc.push(enrichItem(cur));
    }
    return acc;
  }, [])
);
