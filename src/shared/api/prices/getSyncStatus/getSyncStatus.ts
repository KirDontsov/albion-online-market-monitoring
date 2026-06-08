import { API_BASE_URL } from "@/shared/constants";
import type { SyncStatus } from "../syncPrices/syncPrices";

export async function getSyncStatus(): Promise<SyncStatus | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/prices/status`);
    const data = await response.json();
    return data || null;
  } catch (e) {
    console.log(e);
    return null;
  }
}
