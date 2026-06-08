import { API_BASE_URL } from "@/shared/constants";
import type { ExtendedData } from "@/components/CollapsibleTable/interfaces";

export async function getResource(id: string | null): Promise<ExtendedData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resource/${id ?? ""}`);
    const data = await response.json();

    return data || null;
  } catch (e) {
    console.log(e);
    return null;
  }
}
