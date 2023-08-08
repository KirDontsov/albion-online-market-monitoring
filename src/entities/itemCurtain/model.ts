import { createDistinctUntilChangedStore } from "@/shared";

export const [$selectedItem, setSelectedItem] = createDistinctUntilChangedStore<
  string | null
>(null);

export const [$copiedItem, setCopiedItem] = createDistinctUntilChangedStore<
  string | null
>(null);
