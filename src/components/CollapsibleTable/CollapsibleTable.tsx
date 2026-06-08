import { FC, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
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
import styles from "./table.module.scss";
import cn from "classnames";

const SubRow = ({ row, open }: { row?: ExtendedData; open: boolean }) => {
  const artefact = row?.artefact;

  return (
    <TableRow>
      <TableCell className={styles.subRowCell} colSpan={10}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box className={styles.subRowBox}>
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
                {artefact ? (
                  <TableRow sx={{ "&:hover": { background: "rgba(124,107,240,0.06)" } }}>
                    <TableCell component="th" scope="row" className={styles.subRowLabel}>
                      {artefact.label}
                    </TableCell>
                    <TableCell align="right">{artefact.sell_price_thetford || "—"}</TableCell>
                    <TableCell align="right">{artefact.sell_price_fort_sterling || "—"}</TableCell>
                    <TableCell align="right">{artefact.sell_price_martlock || "—"}</TableCell>
                    <TableCell align="right">{artefact.sell_price_brecilien || "—"}</TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" className={styles.subRowEmpty}>
                      Нет данных об артефакте
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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

  const profit_thetford = !/@/.test(row.item_id)
    ? Math.floor(
        Number(row.sell_price_thetford) -
          Number(row.craft_price) -
          (Number(row.sell_price_thetford) / 100) * 10.5
      )
    : Math.floor(
        Number(row.sell_price_thetford) -
          Number(row.enchantment_price) -
          (Number(row.sell_price_thetford) / 100) * 10.5
      );

  const profit_fort = !/@/.test(row.item_id)
    ? Math.floor(
        Number(row.sell_price_fort_sterling) -
          Number(row.craft_price) -
          (Number(row.sell_price_fort_sterling) / 100) * 10.5
      )
    : Math.floor(
        Number(row.sell_price_fort_sterling) -
          Number(row.enchantment_price) -
          (Number(row.sell_price_fort_sterling) / 100) * 10.5
      );

  const profit_martlock = !/@/.test(row.item_id)
    ? Math.floor(
        Number(row.sell_price_martlock) -
          Number(row.craft_price) -
          (Number(row.sell_price_martlock) / 100) * 10.5
      )
    : Math.floor(
        Number(row.sell_price_martlock) -
          Number(row.enchantment_price) -
          (Number(row.sell_price_martlock) / 100) * 10.5
      );

  const profit_brecilien = !/@/.test(row.item_id)
    ? Math.floor(
        Number(row.sell_price_brecilien) -
          Number(row.craft_price) -
          (Number(row.sell_price_brecilien) / 100) * 10.5
      )
    : Math.floor(
        Number(row.sell_price_brecilien) -
          Number(row.enchantment_price) -
          (Number(row.sell_price_brecilien) / 100) * 10.5
      );

  const handleClickCell = useCallback(
    (value: string, id: string) => {
      navigator.clipboard.writeText(value).then();
      copyItem(id);
    },
    [copyItem]
  );

  const tier = row.item_id.split("_")[0]?.[1];

  const priceBg = (cityPrice: string) => {
    if (row.maxPrice === cityPrice) return PRIMARY_BG;
    return "";
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
              style={{ background: priceBg(row.sell_price_thetford) }}
              align="right"
              sx={{ fontFamily: "monospace" }}
            >
              {row.sell_price_thetford}
            </TableCell>

            <TableCell
              onClick={() => handleOpenCurtain(row.item_id)}
              style={{ background: priceBg(row.sell_price_fort_sterling) }}
              align="right"
              sx={{ fontFamily: "monospace" }}
            >
              {row.sell_price_fort_sterling}
            </TableCell>

            <TableCell
              onClick={() => handleOpenCurtain(row.item_id)}
              style={{ background: priceBg(row.sell_price_martlock) }}
              align="right"
              sx={{ fontFamily: "monospace" }}
            >
              {row.sell_price_martlock}
            </TableCell>
            <TableCell
              onClick={() => handleOpenCurtain(row.item_id)}
              style={{ background: priceBg(row.sell_price_brecilien) }}
              align="right"
              sx={{ fontFamily: "monospace" }}
            >
              {row.sell_price_brecilien}
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
              className={styles.lastCell}
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
}

export const CollapsibleTable: FC<CollapsibleTableProps> = ({
  data,
  artefacts = false,
  expandable = true,
  simple = false,
}) => {
  return (
    <TableContainer component={"div"}>
      <Table
        aria-label="collapsible table"
        size="small"
        style={{ maxWidth: "900px" }}
      >
        <TableHead>
          <TableRow className={styles.headRow}>
            {expandable && <TableCell />}
            <TableCell>Предмет</TableCell>
            {simple && <TableCell align="right">ID</TableCell>}
            {!simple && <TableCell align="right">Тир</TableCell>}
            {!simple && (
              <>
                <TableCell align="right">Ц. Thet</TableCell>
                <TableCell align="right">Ц. Fort</TableCell>
                <TableCell align="right">Ц. Mart</TableCell>
                <TableCell align="right">Ц. Brec</TableCell>
              </>
            )}
            {!simple && !artefacts && (
              <>
                <TableCell align="right">$ Thet</TableCell>
                <TableCell align="right">$ Fort</TableCell>
                <TableCell align="right">$ Mart</TableCell>
                <TableCell align="right">$ Brec</TableCell>
              </>
            )}
            {!simple && (
              <TableCell className={styles.lastHeadCell} align="right">
                Заказы
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, index) => (
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
