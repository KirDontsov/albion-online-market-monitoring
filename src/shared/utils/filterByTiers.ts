import { ExtendedData } from "@/components/CollapsibleTable/interfaces";

export function filterByTiers(data: ExtendedData[], tiers: string[]): ExtendedData[] {
  if (tiers.length === 0) return data;
  return data.filter((item) => {
    const tier = item.item_id.split("_")[0]?.[1];
    return tiers.includes(tier);
  });
}
