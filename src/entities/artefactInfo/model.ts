import { createEffect, createEvent, createStore, sample } from "effector";
import { ExtendedData } from "@/components/CollapsibleTable/interfaces";
import { getArtefact, updateArtefact } from "@/shared/api";
import { fetchArtefactsFx } from "@/entities";
import { createDistinctUntilChangedStore } from "@/shared";

export const $artefactInfo = createStore<ExtendedData | null>(null);
export const $artefactInfoLoading = createStore<boolean>(false);

export const [$selectedArtefact, setSelectedArtefact] =
  createDistinctUntilChangedStore<string | null>(null);

export const fetchArtefactFx = createEffect(async (id: string | null) => {
  const data = await getArtefact(id);
  return data;
});

sample({
  source: $selectedArtefact,
  filter: (s) => s !== null,
  target: fetchArtefactFx,
});

sample({
  clock: fetchArtefactFx.doneData,
  target: $artefactInfo,
});

sample({
  clock: fetchArtefactFx.pending,
  target: $artefactInfoLoading,
});

export const updateArtefactFx = createEffect(
  async (artefact: ExtendedData | null) => {
    const data = await updateArtefact(artefact);
    return data;
  }
);
export const updateArtefactInfo = createEvent<ExtendedData>();

sample({
  clock: updateArtefactInfo,
  target: updateArtefactFx,
});

sample({
  clock: updateArtefactFx.doneData,
  target: fetchArtefactsFx,
});

sample({
  clock: updateArtefactFx.doneData,
  fn: () => null,
  target: setSelectedArtefact,
});
