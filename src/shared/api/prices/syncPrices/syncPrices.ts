import { API_BASE_URL } from "@/shared/constants";

export interface SyncStatus {
  last_sync: number | null;
  items_updated: number;
  items_skipped: number;
  errors: number;
  running: boolean;
}

export async function syncPrices(): Promise<SyncStatus | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/prices/sync`, {
      method: "POST",
    });
    const data = await response.json();
    return data || null;
  } catch (e) {
    console.log(e);
    return null;
  }
}
