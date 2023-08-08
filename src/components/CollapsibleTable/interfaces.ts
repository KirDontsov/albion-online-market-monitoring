export interface Data {
  label: string;
  item_id: string;
  craft_price: string;
  enchantment_price: string;
  artefact_id: string;
  sell_price_fort_sterling: string;
  sell_price_martlock: string;
  sell_price_thetford: string;
  sell_price_brecilien: string;
  buy_price_fort_sterling: string;
  buy_price_martlock: string;
  buy_price_thetford: string;
  buy_price_brecilien: string;
  orders_fort_sterling: string;
  orders_martlock: string;
  orders_thetford: string;
  orders_brecilien: string;
  created_at: string;
  updated_at: string;
}

export interface ExtendedData extends Data {
  subItems?: Data[];
  ingridients?: Data[];
  maxPrice?: string;
  maxProfit?: string;
  artefact?: Data;
}
