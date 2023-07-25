import { createGate } from "effector-react";
import { combine, createEffect, createStore, forward, sample } from "effector";
import { getItems } from "@/shared/api/getItems/getItems";
import { ExtendedData } from "@/components/CollapsibleTable/interfaces";

export const $items = createStore<ExtendedData[] | null>([]);
export const $itemsLoading = createStore<boolean>(false);

export const MonitoringGate = createGate("MonitoringGate");

export const fetchItemsFx = createEffect(async () => {
  const data = await getItems();
  return data || [];
});

forward({
  from: MonitoringGate.open,
  to: fetchItemsFx,
});

sample({
  clock: fetchItemsFx.doneData,
  target: $items,
});

sample({
  clock: fetchItemsFx.pending,
  target: $itemsLoading,
});

export const $martlockCraftItems = combine($items, (items) =>
  items?.reduce((acc: ExtendedData[], cur) => {
    if (/OFF/.test(cur.item_id) && !/ARTEFACT/.test(cur.item_id)) {
      acc.push({
        ...cur,
        maxPrice: Math.max(
          ...[
            Number(cur.sell_price_thetford),
            Number(cur.sell_price_fort_sterling),
            Number(cur.sell_price_martlock),
          ]
        ).toString(),
        maxProfit: Math.max(
          ...[
            Math.floor(
              Number(cur.sell_price_thetford) -
                Number(cur.craft_price) -
                (Number(cur.sell_price_thetford) / 100) * 10.5
            ),
            Math.floor(
              Number(cur.sell_price_fort_sterling) -
                Number(cur.craft_price) -
                (Number(cur.sell_price_fort_sterling) / 100) * 10.5
            ),
            Math.floor(
              Number(cur.sell_price_martlock) -
                Number(cur.craft_price) -
                (Number(cur.sell_price_martlock) / 100) * 10.5
            ),
          ]
        ).toString(),
      });
    }
    return acc;
  }, [])
);

export const $otherItems = combine($items, (items) =>
  items?.reduce((acc: ExtendedData[], cur) => {
    if (/T4_2H|T4_MAIN/.test(cur.item_id) && !/ARTEFACT/.test(cur.item_id)) {
      acc.push({
        ...cur,
        maxPrice: Math.max(
          ...[
            Number(cur.sell_price_thetford),
            Number(cur.sell_price_fort_sterling),
            Number(cur.sell_price_martlock),
          ]
        ).toString(),
        maxProfit: Math.max(
          ...[
            Math.floor(
              Number(cur.sell_price_thetford) -
                Number(cur.craft_price) -
                (Number(cur.sell_price_thetford) / 100) * 10.5
            ),
            Math.floor(
              Number(cur.sell_price_fort_sterling) -
                Number(cur.craft_price) -
                (Number(cur.sell_price_fort_sterling) / 100) * 10.5
            ),
            Math.floor(
              Number(cur.sell_price_martlock) -
                Number(cur.craft_price) -
                (Number(cur.sell_price_martlock) / 100) * 10.5
            ),
          ]
        ).toString(),
      });
    }
    return acc;
  }, [])
);

export const $artefactItems = combine($items, (items) =>
  items?.reduce((acc: ExtendedData[], cur) => {
    if (/ARTEFACT/.test(cur.item_id) && !/T4_2H|T4_MAIN/.test(cur.item_id)) {
      acc.push({
        ...cur,
        maxPrice: Math.min(
          ...[
            Number(cur.sell_price_thetford),
            Number(cur.sell_price_fort_sterling),
            Number(cur.sell_price_martlock),
          ]
        ).toString(),
        maxProfit: Math.min(
          ...[
            Math.floor(
              Number(cur.sell_price_thetford) -
                Number(cur.craft_price) -
                (Number(cur.sell_price_thetford) / 100) * 10.5
            ),
            Math.floor(
              Number(cur.sell_price_fort_sterling) -
                Number(cur.craft_price) -
                (Number(cur.sell_price_fort_sterling) / 100) * 10.5
            ),
            Math.floor(
              Number(cur.sell_price_martlock) -
                Number(cur.craft_price) -
                (Number(cur.sell_price_martlock) / 100) * 10.5
            ),
          ]
        ).toString(),
      });
    }
    return acc;
  }, [])
);
