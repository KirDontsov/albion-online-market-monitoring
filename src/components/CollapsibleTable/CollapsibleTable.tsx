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

const SubRow = ({ open }: { row?: ExtendedData; open: boolean }) => {
  return (
    <TableRow /* CollapsibleRow */>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ marginTop: 1 }}>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Ресурс</TableCell>
                  <TableCell>Кол-во</TableCell>
                  <TableCell align="right">Цена/шт</TableCell>
                  <TableCell align="right">Цена изготовления</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    date
                  </TableCell>
                  <TableCell>customerId</TableCell>
                  <TableCell align="right">amount</TableCell>
                  <TableCell align="right">price</TableCell>
                </TableRow>
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
}

const PRIMARY = "#885AF8";
const SUCCESS = "#2ED47A";
const NEGATIVE = "#F7685B";
export const Row: FC<RowProps> = ({ row, index, artefacts = false }) => {
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
        <TableCell className={styles.firstCell}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleCollapse}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          onClick={() =>
            handleClickCell(row.label.split(" (знаток)")[0], row.item_id)
          }
        >
          {row.label.split(" (знаток)")[0]}
        </TableCell>
        <TableCell align="right" onClick={() => handleOpenCurtain(row.item_id)}>
          {/@/.test(row.item_id)
            ? [`${tier}.`, row.item_id.split("@")[1]].concat()
            : tier}
        </TableCell>
        <TableCell
          onClick={() => handleOpenCurtain(row.item_id)}
          style={{
            background: row.maxPrice === row.sell_price_thetford ? PRIMARY : "",
          }}
          align="right"
        >
          {row.sell_price_thetford}
        </TableCell>

        <TableCell
          onClick={() => handleOpenCurtain(row.item_id)}
          style={{
            background:
              row.maxPrice === row.sell_price_fort_sterling ? PRIMARY : "",
          }}
          align="right"
        >
          {row.sell_price_fort_sterling}
        </TableCell>

        <TableCell
          onClick={() => handleOpenCurtain(row.item_id)}
          style={{
            background: row.maxPrice === row.sell_price_martlock ? PRIMARY : "",
          }}
          align="right"
        >
          {row.sell_price_martlock}
        </TableCell>
        <TableCell
          onClick={() => handleOpenCurtain(row.item_id)}
          style={{
            background:
              row.maxPrice === row.sell_price_brecilien ? PRIMARY : "",
          }}
          align="right"
        >
          {row.sell_price_brecilien}
        </TableCell>
        {!artefacts && (
          <>
            <TableCell
              onClick={() => handleOpenCurtain(row.item_id)}
              style={{
                background:
                  profit_thetford <= 0
                    ? NEGATIVE
                    : Number(row.maxProfit) === profit_thetford
                    ? SUCCESS
                    : "",
              }}
              align="right"
            >
              {profit_thetford}
            </TableCell>
            <TableCell
              onClick={() => handleOpenCurtain(row.item_id)}
              style={{
                background:
                  profit_fort <= 0
                    ? NEGATIVE
                    : Number(row.maxProfit) === profit_fort
                    ? SUCCESS
                    : "",
              }}
              align="right"
            >
              {profit_fort}
            </TableCell>
            <TableCell
              onClick={() => handleOpenCurtain(row.item_id)}
              style={{
                background:
                  profit_martlock <= 0
                    ? NEGATIVE
                    : Number(row.maxProfit) === profit_martlock
                    ? SUCCESS
                    : "",
              }}
              align="right"
            >
              {profit_martlock}
            </TableCell>
            <TableCell
              onClick={() => handleOpenCurtain(row.item_id)}
              style={{
                background:
                  profit_brecilien <= 0
                    ? NEGATIVE
                    : Number(row.maxProfit) === profit_brecilien
                    ? SUCCESS
                    : "",
              }}
              align="right"
            >
              {profit_brecilien}
            </TableCell>
          </>
        )}
        <TableCell
          className={styles.lastCell}
          onClick={() => handleOpenCurtain(row.item_id)}
          align="right"
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
      </TableRow>
      <SubRow key={row.item_id} row={row} open={open} />
    </>
  );
};

export interface CollapsibleTableProps {
  data: ExtendedData[];
  artefacts?: boolean;
}

export const CollapsibleTable: FC<CollapsibleTableProps> = ({
  data,
  artefacts = false,
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
            <TableCell />
            <TableCell>Предмет</TableCell>
            <TableCell align="right">Тир</TableCell>
            <TableCell align="right">Ц. Thet</TableCell>
            <TableCell align="right">Ц. Fort</TableCell>
            <TableCell align="right">Ц. Mart</TableCell>
            <TableCell align="right">Ц. Brec</TableCell>
            {!artefacts && (
              <>
                <TableCell align="right">$ Thet</TableCell>
                <TableCell align="right">$ Fort</TableCell>
                <TableCell align="right">$ Mart</TableCell>
                <TableCell align="right">$ Brec</TableCell>
              </>
            )}

            <TableCell className={styles.lastHeadCell} align="right">
              Заказы
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, index) => (
            <Row
              key={row.item_id}
              row={row}
              index={index}
              artefacts={artefacts}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
