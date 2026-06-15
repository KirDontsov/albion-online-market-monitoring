import { FC, useCallback, useMemo, useState, useRef, useEffect, CSSProperties } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ExtendedData } from "@/components/CollapsibleTable/interfaces";
import { useEvent, useStore } from "effector-react";
import {
  $copiedItem,
  setCopiedItem,
  setSelectedArtefact,
  setSelectedItem,
} from "@/entities";
import { $resourcesMap } from "@/entities/resources/model";
import styles from "./table.module.scss";
import cn from "classnames";

type SortKey =
  | "label"
  | "item_id"
  | "tier"
  | "popularity"
  | "sell_price_thetford"
  | "sell_price_fort_sterling"
  | "sell_price_martlock"
  | "sell_price_brecilien"
  | "profit_thetford"
  | "profit_fort"
  | "profit_martlock"
  | "profit_brecilien";

type SortDir = "asc" | "desc";

const getTier = (item_id: string) => {
  const t = item_id.split("_")[0]?.[1];
  return t ? Number(t) : 0;
};

const getProfit = (row: ExtendedData, city: "thetford" | "fort_sterling" | "martlock" | "brecilien") => {
  return Number(row[`profit_${city}` as keyof ExtendedData]) || 0;
};

const renderStars = (popularity?: string) => {
  const n = Number(popularity) || 0;
  const clamped = Math.max(0, Math.min(5, n));
  return "★".repeat(clamped) + "☆".repeat(5 - clamped);
};

function sortData(
  data: ExtendedData[],
  sortKey: SortKey | null,
  sortDir: SortDir
): ExtendedData[] {
  return [...data].sort((a, b) => {
    const popA = Number(a.popularity) || 0;
    const popB = Number(b.popularity) || 0;
    if (popA !== popB) return popB - popA;

    if (!sortKey) return 0;

    let av: string | number;
    let bv: string | number;
    switch (sortKey) {
      case "popularity":
        av = Number(a.popularity) || 0;
        bv = Number(b.popularity) || 0;
        break;
      case "tier":
        av = getTier(a.item_id);
        bv = getTier(b.item_id);
        break;
      case "profit_thetford":
        av = getProfit(a, "thetford");
        bv = getProfit(b, "thetford");
        break;
      case "profit_fort":
        av = getProfit(a, "fort_sterling");
        bv = getProfit(b, "fort_sterling");
        break;
      case "profit_martlock":
        av = getProfit(a, "martlock");
        bv = getProfit(b, "martlock");
        break;
      case "profit_brecilien":
        av = getProfit(a, "brecilien");
        bv = getProfit(b, "brecilien");
        break;
      default:
        av = (a as unknown as Record<string, string>)[sortKey] ?? "";
        bv = (b as unknown as Record<string, string>)[sortKey] ?? "";
    }
    if (typeof av === "number" && typeof bv === "number") {
      return sortDir === "asc" ? av - bv : bv - av;
    }
    const as = String(av).toLowerCase();
    const bs = String(bv).toLowerCase();
    return sortDir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
  });
}

const SubRow = ({ row, open }: { row?: ExtendedData; open: boolean }) => {
  const artefact = row?.artefact;
  const resources = row?.resources;
  const resourcesMap = useStore($resourcesMap);

  const resourceRows = resources?.map((r) => {
    const resData = resourcesMap.get(r.item_id);
    const label = resData?.label ?? r.item_id;
    const count = Number(r.count);
    const priceThet = Number(resData?.sell_price_thetford) || 0;
    const priceFort = Number(resData?.sell_price_fort_sterling) || 0;
    const priceMart = Number(resData?.sell_price_martlock) || 0;
    const priceBrec = Number(resData?.sell_price_brecilien) || 0;
    return { ...r, label, count, priceThet, priceFort, priceMart, priceBrec };
  }) ?? [];

  const totalThet = resourceRows.reduce((s, r) => s + r.priceThet * r.count, 0);
  const totalFort = resourceRows.reduce((s, r) => s + r.priceFort * r.count, 0);
  const totalMart = resourceRows.reduce((s, r) => s + r.priceMart * r.count, 0);
  const totalBrec = resourceRows.reduce((s, r) => s + r.priceBrec * r.count, 0);

  const hasResources = resourceRows.length > 0;

  return (
    <TableRow>
      <TableCell className={styles.subRowCell} colSpan={14}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box className={styles.subRowBox}>
            {artefact && (
              <Table size="small" aria-label="artefact details">
                <TableHead>
                  <TableRow>
                    <TableCell>Артефакт</TableCell>
                    <TableCell align="right">Цена Thet</TableCell>
                    <TableCell align="right">Цена Fort</TableCell>
                    <TableCell align="right">Цена Mart</TableCell>
                    <TableCell align="right">Цена Brec</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ "&:hover": { background: "rgba(124,107,240,0.06)" } }}>
                    <TableCell component="th" scope="row" className={styles.subRowLabel}>
                      {artefact.label}
                    </TableCell>
                    <TableCell align="right">{artefact.sell_price_thetford || "—"}</TableCell>
                    <TableCell align="right">{artefact.sell_price_fort_sterling || "—"}</TableCell>
                    <TableCell align="right">{artefact.sell_price_martlock || "—"}</TableCell>
                    <TableCell align="right">{artefact.sell_price_brecilien || "—"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
            {hasResources && (
              <Table size="small" aria-label="crafting resources" sx={{ mt: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Ресурс</TableCell>
                    <TableCell align="right">Кол-во</TableCell>
                    <TableCell align="right">Цена/шт Thet</TableCell>
                    <TableCell align="right">Цена/шт Fort</TableCell>
                    <TableCell align="right">Цена/шт Mart</TableCell>
                    <TableCell align="right">Цена/шт Brec</TableCell>
                    <TableCell align="right">Сумма Thet</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resourceRows.map((r) => (
                    <TableRow key={r.item_id} sx={{ "&:hover": { background: "rgba(124,107,240,0.06)" } }}>
                      <TableCell component="th" scope="row" className={styles.subRowLabel}>
                        {r.label}
                      </TableCell>
                      <TableCell align="right">{r.count}</TableCell>
                      <TableCell align="right">{r.priceThet || "—"}</TableCell>
                      <TableCell align="right">{r.priceFort || "—"}</TableCell>
                      <TableCell align="right">{r.priceMart || "—"}</TableCell>
                      <TableCell align="right">{r.priceBrec || "—"}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {r.priceThet * r.count || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6} align="right" sx={{ fontWeight: 600, color: "#c0b8f8" }}>
                      Итого:
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "#c0b8f8" }}>
                      {totalThet || "—"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
            {!artefact && !hasResources && (
              <Box sx={{ color: "#8a8ca0", fontStyle: "italic", py: 1 }}>
                Нет данных о крафте
              </Box>
            )}
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export interface RowProps {
  row: ExtendedData;
  index: number;
  artefacts?: boolean;
  expandable?: boolean;
  simple?: boolean;
}

const PRIMARY = "#7c6bf0";
const PRIMARY_BG = "rgba(124, 107, 240, 0.15)";
const SUCCESS = "#26d97f";
const SUCCESS_BG = "rgba(38, 217, 127, 0.12)";
const NEGATIVE = "#f06050";
const NEGATIVE_BG = "rgba(240, 96, 80, 0.12)";
const ONE_DAY_MS = 86400000;

export const Row: FC<RowProps> = ({ row, index, artefacts = false, expandable = true, simple = false }) => {
  const [open, setOpen] = useState(false);
  const handleCollapse = () => setOpen((prevState) => !prevState);
  const copiedItem = useStore($copiedItem);
  const copyItem = useEvent(setCopiedItem);
  const selectItem = useEvent(setSelectedItem);
  const selectArtefact = useEvent(setSelectedArtefact);

  const handleOpenCurtain = useCallback(
    (id: string) => {
      if (!artefacts) {
        selectItem(id);
      } else {
        selectArtefact(id);
      }
    },
    [artefacts, selectArtefact, selectItem]
  );

  const profit_thetford = getProfit(row, "thetford");
  const profit_fort = getProfit(row, "fort_sterling");
  const profit_martlock = getProfit(row, "martlock");
  const profit_brecilien = getProfit(row, "brecilien");

  const handleClickCell = useCallback(
    (value: string, id: string) => {
      navigator.clipboard.writeText(value).then();
      copyItem(id);
    },
    [copyItem]
  );

  const tier = row.item_id.split("_")[0]?.[1];

  const priceBg = (cityPrice: string) => {
    if (artefacts && row.minPrice && row.minPrice === cityPrice && Number(cityPrice) > 0) return SUCCESS_BG;
    if (row.maxPrice === cityPrice) return PRIMARY_BG;
    return "";
  };

  const priceCellStyle = (cityPrice: string): CSSProperties => {
    const bg = priceBg(cityPrice);
    if (row.source !== "manual" || !row.updated_at) return { background: bg };
    const now = Date.now();
    const updated = Number(row.updated_at) * 1000;
    const age = now - updated;
    if (age < 0 || age > ONE_DAY_MS) {
      return { background: "rgba(200, 40, 40, 0.25)" };
    }
    return { background: "rgba(240, 96, 80, 0.15)" };
  };

  const priceDateLabel = (): string | null => {
    if (row.source !== "manual" || !row.updated_at) return null;
    const updated = Number(row.updated_at) * 1000;
    if (isNaN(updated)) return null;
    const d = new Date(updated);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}.${mm}`;
  };

  const isPriceStale = (): boolean => {
    if (row.source !== "manual" || !row.updated_at) return false;
    const now = Date.now();
    const updated = Number(row.updated_at) * 1000;
    const age = now - updated;
    return age >= 0 && age > ONE_DAY_MS;
  };

  const profitBg = (profit: number) => {
    if (profit <= 0) return NEGATIVE_BG;
    if (Number(row.maxProfit) === profit) return SUCCESS_BG;
    return "";
  };

  const profitColor = (profit: number) => {
    if (profit <= 0) return NEGATIVE;
    if (Number(row.maxProfit) === profit) return SUCCESS;
    return "";
  };

  return (
    <>
      <TableRow
        className={cn(`${styles.row}`, {
          [styles.odd]: index % 2 === 0,
          [styles.selected]: row.item_id === copiedItem,
        })}
        sx={{
          "& > *": { borderBottom: "unset" },
        }}
      >
        {expandable && (
          <TableCell className={styles.firstCell}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={handleCollapse}
              sx={{
                color: open ? PRIMARY : "#8a8ca0",
                transition: "color 0.15s ease",
                "&:hover": { color: PRIMARY },
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        <TableCell
          component="th"
          scope="row"
          onClick={() =>
            handleClickCell(row.label.split(" (знаток)")[0], row.item_id)
          }
          sx={{ fontWeight: 500 }}
        >
          {row.label.split(" (знаток)")[0]}
        </TableCell>
        <TableCell
          align="center"
          onClick={() => handleOpenCurtain(row.item_id)}
          sx={{ fontSize: "0.85rem", letterSpacing: "0.05em", color: "#e8b830", minWidth: 60 }}
        >
          {renderStars(row.popularity)}
        </TableCell>
        {simple && (
          <TableCell
            align="right"
            sx={{ color: "#8a8ca0", fontFamily: "monospace", fontSize: "0.8rem" }}
          >
            {row.item_id}
          </TableCell>
        )}
        {!simple && (
          <TableCell
            align="right"
            onClick={() => handleOpenCurtain(row.item_id)}
            sx={{ color: "#8a8ca0", fontFamily: "monospace" }}
          >
            {/@/.test(row.item_id)
              ? [`${tier}.`, row.item_id.split("@")[1]].concat()
              : tier}
          </TableCell>
        )}
        {!simple && (
          <>
            <TableCell
              onClick={() => handleOpenCurtain(row.item_id)}
              style={priceCellStyle(row.sell_price_thetford)}
              align="right"
              sx={{ fontFamily: "monospace" }}
            >
              {row.sell_price_thetford}
              {priceDateLabel() && (
                <span className={cn(styles.priceDate, { [styles.priceDateStale]: isPriceStale() })}>
                  {priceDateLabel()}
                </span>
              )}
            </TableCell>

            <TableCell
              onClick={() => handleOpenCurtain(row.item_id)}
              style={priceCellStyle(row.sell_price_fort_sterling)}
              align="right"
              sx={{ fontFamily: "monospace" }}
            >
              {row.sell_price_fort_sterling}
              {priceDateLabel() && (
                <span className={cn(styles.priceDate, { [styles.priceDateStale]: isPriceStale() })}>
                  {priceDateLabel()}
                </span>
              )}
            </TableCell>

            <TableCell
              onClick={() => handleOpenCurtain(row.item_id)}
              style={priceCellStyle(row.sell_price_martlock)}
              align="right"
              sx={{ fontFamily: "monospace" }}
            >
              {row.sell_price_martlock}
              {priceDateLabel() && (
                <span className={cn(styles.priceDate, { [styles.priceDateStale]: isPriceStale() })}>
                  {priceDateLabel()}
                </span>
              )}
            </TableCell>
            <TableCell
              onClick={() => handleOpenCurtain(row.item_id)}
              style={priceCellStyle(row.sell_price_brecilien)}
              align="right"
              sx={{ fontFamily: "monospace" }}
            >
              {row.sell_price_brecilien}
              {priceDateLabel() && (
                <span className={cn(styles.priceDate, { [styles.priceDateStale]: isPriceStale() })}>
                  {priceDateLabel()}
                </span>
              )}
            </TableCell>
            {!artefacts && (
              <>
                <TableCell
                  onClick={() => handleOpenCurtain(row.item_id)}
                  style={{ background: profitBg(profit_thetford) }}
                  align="right"
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 600,
                    color: profitColor(profit_thetford) || undefined,
                  }}
                >
                  {profit_thetford}
                </TableCell>
                <TableCell
                  onClick={() => handleOpenCurtain(row.item_id)}
                  style={{ background: profitBg(profit_fort) }}
                  align="right"
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 600,
                    color: profitColor(profit_fort) || undefined,
                  }}
                >
                  {profit_fort}
                </TableCell>
                <TableCell
                  onClick={() => handleOpenCurtain(row.item_id)}
                  style={{ background: profitBg(profit_martlock) }}
                  align="right"
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 600,
                    color: profitColor(profit_martlock) || undefined,
                  }}
                >
                  {profit_martlock}
                </TableCell>
                <TableCell
                  onClick={() => handleOpenCurtain(row.item_id)}
                  style={{ background: profitBg(profit_brecilien) }}
                  align="right"
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 600,
                    color: profitColor(profit_brecilien) || undefined,
                  }}
                >
                  {profit_brecilien}
                </TableCell>
              </>
            )}
            <TableCell
              onClick={() => handleOpenCurtain(row.item_id)}
              align="right"
              sx={{ fontSize: "0.8rem", color: "#8a8ca0", lineHeight: 1.4 }}
            >
              {Number(row.orders_thetford) > 0 && (
                <p>{`Thet: ${row.orders_thetford}`}</p>
              )}
              {Number(row.orders_fort_sterling) > 0 && (
                <p>{`Fort: ${row.orders_fort_sterling}`}</p>
              )}
              {Number(row.orders_martlock) > 0 && (
                <p>{`Mart: ${row.orders_martlock}`}</p>
              )}
              {Number(row.orders_brecilien) > 0 && (
                <p>{`Brec: ${row.orders_brecilien}`}</p>
              )}
            </TableCell>
            <TableCell
              className={styles.lastCell}
              onClick={() => handleOpenCurtain(row.item_id)}
              align="left"
              sx={{
                fontSize: "0.75rem",
                color: "#8a8ca0",
                maxWidth: 160,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {row.comment || ""}
            </TableCell>
          </>
        )}
      </TableRow>
      {expandable && <SubRow key={row.item_id} row={row} open={open} />}
    </>
  );
};

export interface CollapsibleTableProps {
  data: ExtendedData[];
  artefacts?: boolean;
  expandable?: boolean;
  simple?: boolean;
  storageKey?: string;
}

interface SortableHeadProps {
  sortKey: SortKey | null;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  artefacts: boolean;
  simple: boolean;
  expandable: boolean;
}

const SortableHead: FC<SortableHeadProps> = ({
  sortKey: activeKey,
  sortDir,
  onSort,
  artefacts,
  simple,
  expandable,
}) => {
  const th = (key: SortKey, label: string, align: "left" | "right" = "right") => (
    <TableCell align={align}>
      <TableSortLabel
        active={activeKey === key}
        direction={activeKey === key ? sortDir : "asc"}
        onClick={() => onSort(key)}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <TableHead>
      <TableRow className={styles.headRow}>
        {expandable && <TableCell />}
        {th("label", "Предмет", "left")}
        {th("popularity", "★")}
        {simple && th("item_id", "ID")}
        {!simple && th("tier", "Тир")}
        {!simple && (
          <>
            {th("sell_price_thetford", "Ц. Thet")}
            {th("sell_price_fort_sterling", "Ц. Fort")}
            {th("sell_price_martlock", "Ц. Mart")}
            {th("sell_price_brecilien", "Ц. Brec")}
          </>
        )}
        {!simple && !artefacts && (
          <>
            {th("profit_thetford", "$ Thet")}
            {th("profit_fort", "$ Fort")}
            {th("profit_martlock", "$ Mart")}
            {th("profit_brecilien", "$ Brec")}
          </>
        )}
        {!simple && (
          <TableCell align="right">
            Заказы
          </TableCell>
        )}
        <TableCell align="left" sx={{ fontSize: "0.75rem", color: "#8a8ca0" }}>
          Комментарий
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export const CollapsibleTable: FC<CollapsibleTableProps> = ({
  data,
  artefacts = false,
  expandable = true,
  simple = false,
  storageKey,
}) => {
  const [sortKey, setSortKey] = useState<SortKey | null>(() => {
    if (!storageKey) return null;
    try {
      const saved = localStorage.getItem(`${storageKey}_sort_key`);
      return saved ? (JSON.parse(saved) as SortKey) : null;
    } catch {
      return null;
    }
  });
  const [sortDir, setSortDir] = useState<SortDir>(() => {
    if (!storageKey) return "asc";
    try {
      const saved = localStorage.getItem(`${storageKey}_sort_dir`);
      return saved ? (JSON.parse(saved) as SortDir) : "asc";
    } catch {
      return "asc";
    }
  });
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!storageKey) return;
    localStorage.setItem(`${storageKey}_sort_key`, JSON.stringify(sortKey));
    localStorage.setItem(`${storageKey}_sort_dir`, JSON.stringify(sortDir));
  }, [storageKey, sortKey, sortDir]);

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey]
  );

  const sorted = useMemo(() => sortData(data, sortKey, sortDir), [data, sortKey, sortDir]);

  return (
    <TableContainer component={"div"}>
      <Table
        aria-label="collapsible table"
        size="small"
        style={{ maxWidth: "900px" }}
      >
        <SortableHead
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          artefacts={artefacts}
          simple={simple}
          expandable={expandable}
        />
        <TableBody>
          {sorted.map((row, index) => (
            <Row
              key={row.item_id}
              row={row}
              index={index}
              artefacts={artefacts}
              expandable={expandable}
              simple={simple}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
