import { API_BASE_URL } from "@/shared/constants";
import type { ExtendedData } from "@/components/CollapsibleTable/interfaces";

export async function createResource(
  resource: ExtendedData
): Promise<ExtendedData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/resource/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resource),
    });
    const data = await response.json();
    return data || null;
  } catch (e) {
    console.log(e);
    return null;
  }
}
