import { API_BASE_URL } from "@/shared/constants";
import type { ExtendedData } from "@/components/CollapsibleTable/interfaces";

export async function updateItem(
  item: ExtendedData | null
): Promise<ExtendedData | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/item/${item?.item_id ?? ""}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      }
    );
    const data = await response.json();

    return data || [];
  } catch (e) {
    console.log(e);
    return null;
  }
}
