import { createGate } from "effector-react";
import { combine, createEffect, createStore, forward, sample } from "effector";
import { ExtendedData } from "@/components/CollapsibleTable/interfaces";
import { getArtefacts } from "@/shared/api";

export const $artefacts = createStore<ExtendedData[] | null>([]);
export const $artefactsLoading = createStore<boolean>(false);

export const ArtefactsGate = createGate("ArtefactsGate");

export const fetchArtefactsFx = createEffect(async () => {
  const data = await getArtefacts();
  return data || [];
});

forward({
  from: ArtefactsGate.open,
  to: fetchArtefactsFx,
});

sample({
  clock: fetchArtefactsFx.doneData,
  target: $artefacts,
});

sample({
  clock: fetchArtefactsFx.pending,
  target: $artefactsLoading,
});

export const $artefactItems = combine($artefacts, (items) =>
  items?.reduce((acc: ExtendedData[], cur) => {
    if (/ARTEFACT/.test(cur.item_id)) {
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
