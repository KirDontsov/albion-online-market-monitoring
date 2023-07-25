import type { ExtendedData } from "@/components/CollapsibleTable/interfaces";

export async function getItems(): Promise<ExtendedData[] | null> {
  try {
    const response = await fetch("http://127.0.0.1:8080/api/items");
    const data = await response.json();

    return data || [];
  } catch (e) {
    console.log(e);
    return null;
  }
}
