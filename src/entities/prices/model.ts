import { createEffect, createStore, sample } from "effector";
import { createGate } from "effector-react";
import { syncPrices, getSyncStatus, SyncStatus } from "@/shared/api";

export const $syncStatus = createStore<SyncStatus>({
  last_sync: null,
  items_updated: 0,
  items_skipped: 0,
  errors: 0,
  running: false,
});

export const $syncLoading = createStore<boolean>(false);

export const syncPricesFx = createEffect(async (itemIds?: string[]) => {
  const data = await syncPrices(itemIds);
  return data;
});

export const fetchSyncStatusFx = createEffect(async () => {
  const data = await getSyncStatus();
  return data;
});

sample({
  clock: syncPricesFx.doneData,
  filter: (data): data is SyncStatus => data !== null,
  target: $syncStatus,
});

sample({
  clock: syncPricesFx.pending,
  target: $syncLoading,
});

sample({
  clock: fetchSyncStatusFx.doneData,
  filter: (data): data is SyncStatus => data !== null,
  target: $syncStatus,
});

// Auto-fetch status on gate open
export const PricesGate = createGate("PricesGate");

sample({
  clock: PricesGate.open,
  target: fetchSyncStatusFx,
});
