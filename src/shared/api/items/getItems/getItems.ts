import { API_BASE_URL } from "@/shared/constants";
import type { ExtendedData } from "@/components/CollapsibleTable/interfaces";

export async function getItems(): Promise<ExtendedData[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/items`);
    const data = await response.json();

    return data || [];
  } catch (e) {
    console.log(e);
    return null;
  }
}
