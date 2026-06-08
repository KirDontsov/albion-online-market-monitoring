import { createEffect, createEvent, createStore, sample } from "effector";
import { ExtendedData } from "@/components/CollapsibleTable/interfaces";
import { getResource, updateResource, createResource } from "@/shared/api";
import { fetchResourcesFx } from "@/entities";
import { createDistinctUntilChangedStore } from "@/shared";

const NEW_RESOURCE_ID = "__new__";

export const $resourceInfo = createStore<ExtendedData | null>(null);
export const $resourceInfoLoading = createStore<boolean>(false);

export const [$selectedResource, setSelectedResource] =
  createDistinctUntilChangedStore<string | null>(null);

// Fetch single resource
export const fetchResourceFx = createEffect(async (id: string | null) => {
  const data = await getResource(id);
  return data;
});

sample({
  source: $selectedResource,
  filter: (s) => s !== null && s !== NEW_RESOURCE_ID,
  target: fetchResourceFx,
});

sample({
  clock: fetchResourceFx.doneData,
  target: $resourceInfo,
});

sample({
  clock: fetchResourceFx.pending,
  target: $resourceInfoLoading,
});

// Update resource
export const updateResourceFx = createEffect(
  async (resource: ExtendedData | null) => {
    const data = await updateResource(resource);
    return data;
  }
);
export const updateResourceInfo = createEvent<ExtendedData>();

sample({
  clock: updateResourceInfo,
  target: updateResourceFx,
});

sample({
  clock: updateResourceFx.doneData,
  target: fetchResourcesFx,
});

sample({
  clock: updateResourceFx.doneData,
  fn: () => null,
  target: setSelectedResource,
});

// Create resource
export const createNewResourceFx = createEffect(async (resource: ExtendedData) => {
  const data = await createResource(resource);
  return data;
});
export const createNewResource = createEvent<ExtendedData>();

sample({
  clock: createNewResource,
  target: createNewResourceFx,
});

sample({
  clock: createNewResourceFx.doneData,
  target: fetchResourcesFx,
});

sample({
  clock: createNewResourceFx.doneData,
  fn: () => null,
  target: setSelectedResource,
});
