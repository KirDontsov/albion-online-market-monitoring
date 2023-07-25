import { createDistinctUntilChangedStore } from "@/shared";

export const [$selectedItem, setSelectedItem] = createDistinctUntilChangedStore<
  string | null
>(null);
