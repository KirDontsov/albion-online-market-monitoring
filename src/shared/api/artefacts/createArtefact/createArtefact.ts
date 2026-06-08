import { API_BASE_URL } from "@/shared/constants";
import type { ExtendedData } from "@/components/CollapsibleTable/interfaces";

export async function createArtefact(
  artefact: ExtendedData
): Promise<ExtendedData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/artefact/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(artefact),
    });
    const data = await response.json();
    return data || null;
  } catch (e) {
    console.log(e);
    return null;
  }
}
