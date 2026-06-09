import { API_BASE_URL } from "@/shared/constants";

export interface SyncStatus {
  last_sync: number | null;
  items_updated: number;
  items_skipped: number;
  errors: number;
  running: boolean;
}

export async function syncPrices(itemIds?: string[]): Promise<SyncStatus | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/prices/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_ids: itemIds ?? [] }),
    });
    const data = await response.json();
    return data || null;
  } catch (e) {
    console.log(e);
    return null;
  }
}
