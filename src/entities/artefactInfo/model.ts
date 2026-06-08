import { createEffect, createEvent, createStore, sample } from "effector";
import { ExtendedData } from "@/components/CollapsibleTable/interfaces";
import { getArtefact, updateArtefact, createArtefact } from "@/shared/api";
import { fetchArtefactsFx } from "@/entities";
import { createDistinctUntilChangedStore } from "@/shared";

const NEW_ARTEFACT_ID = "__new__";

export const $artefactInfo = createStore<ExtendedData | null>(null);
export const $artefactInfoLoading = createStore<boolean>(false);

export const [$selectedArtefact, setSelectedArtefact] =
  createDistinctUntilChangedStore<string | null>(null);

// Fetch single artefact
export const fetchArtefactFx = createEffect(async (id: string | null) => {
  const data = await getArtefact(id);
  return data;
});

sample({
  source: $selectedArtefact,
  filter: (s) => s !== null && s !== NEW_ARTEFACT_ID,
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

// Update artefact
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

// Create artefact
export const createNewArtefactFx = createEffect(async (artefact: ExtendedData) => {
  const data = await createArtefact(artefact);
  return data;
});
export const createNewArtefact = createEvent<ExtendedData>();

sample({
  clock: createNewArtefact,
  target: createNewArtefactFx,
});

sample({
  clock: createNewArtefactFx.doneData,
  target: fetchArtefactsFx,
});

sample({
  clock: createNewArtefactFx.doneData,
  fn: () => null,
  target: setSelectedArtefact,
});
