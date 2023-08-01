import { createGate } from "effector-react";
import { combine, createEffect, createStore, forward, sample } from "effector";
import { getItems } from "@/shared/api";
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
    if (/OFF/.test(cur.item_id)) {
      const craftPrice = Math.floor(
        [
          Number(cur.artefact?.sell_price_thetford),
          Number(cur.artefact?.sell_price_fort_sterling),
          Number(cur.artefact?.sell_price_martlock),
        ].reduce((acc, next) => acc + next, 0) /
          3 +
          Number(cur.craft_price)
      ).toString();

      acc.push({
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
      });
    }
    return acc;
  }, [])
);

export const $otherItems = combine($items, (items) =>
  items?.reduce((acc: ExtendedData[], cur) => {
    if (/2H|MAIN/.test(cur.item_id)) {
      const craftPrice = Math.floor(
        [
          Number(cur.artefact?.sell_price_thetford),
          Number(cur.artefact?.sell_price_fort_sterling),
          Number(cur.artefact?.sell_price_martlock),
        ].reduce((acc, next) => acc + next, 0) /
          3 +
          Number(cur.craft_price)
      ).toString();
      acc.push({
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
      });
    }
    return acc;
  }, [])
);
