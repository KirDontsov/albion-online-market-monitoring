import type { ExtendedData } from "@/components/CollapsibleTable/interfaces";

export async function getItem(id: string | null): Promise<ExtendedData | null> {
  try {
    const response = await fetch(`http://127.0.0.1:8080/api/item/${id ?? ""}`);
    const data = await response.json();

    return data || [];
  } catch (e) {
    console.log(e);
    return null;
  }
}
