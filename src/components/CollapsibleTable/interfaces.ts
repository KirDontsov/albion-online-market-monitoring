export interface Data {
  label: string;
  item_id: string;
  sell_price_fort_sterling: string;
  sell_price_martlock: string;
  sell_price_thetford: string;
  buy_price_fort_sterling: string;
  buy_price_martlock: string;
  buy_price_thetford: string;
  created_at: string;
  updated_at: string;
}

export interface ExtendedData extends Data {
  subItems?: Data[];
  ingridients?: Data[];
  maxPrice?: string;
}
