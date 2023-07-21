export interface Item {
  id: string;
  label: string;
  tier?: string;
  quantity?: string;
}
export interface ExtendedItem extends Item {
  ingredients?: Item[];
}
