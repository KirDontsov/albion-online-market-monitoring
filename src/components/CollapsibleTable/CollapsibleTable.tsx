import { FC, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ExtendedData } from "@/components/CollapsibleTable/interfaces";

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
}

const PRIMARY = "#885AF8";
export const Row: FC<RowProps> = ({ row }) => {
  const [open, setOpen] = useState(false);
  const handleCollapse = () => setOpen((prevState) => !prevState);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleCollapse}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.label}
        </TableCell>
        <TableCell align="right">
          {/@/.test(row.item_id)
            ? ["4.", row.item_id.split("@")[1]].concat()
            : 4}
        </TableCell>
        <TableCell
          style={{
            background: row.maxPrice === row.sell_price_thetford ? PRIMARY : "",
          }}
          align="right"
        >
          {row.sell_price_thetford}
        </TableCell>

        <TableCell
          style={{
            background:
              row.maxPrice === row.sell_price_fort_sterling ? PRIMARY : "",
          }}
          align="right"
        >
          {row.sell_price_fort_sterling}
        </TableCell>

        <TableCell
          style={{
            background: row.maxPrice === row.sell_price_martlock ? PRIMARY : "",
          }}
          align="right"
        >
          {row.sell_price_martlock}
        </TableCell>
        {/*<TableCell align="right">{row.profit_thetford}</TableCell>*/}
        {/*<TableCell align="right">{row.profit_fort}</TableCell>*/}
        {/*<TableCell align="right">{row.profit_martlock}</TableCell>*/}
      </TableRow>
      <SubRow key={row.item_id} row={row} open={open} />
    </>
  );
};

export interface CollapsibleTableProps {
  data: ExtendedData[];
}

export const CollapsibleTable: FC<CollapsibleTableProps> = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table
        aria-label="collapsible table"
        size="small"
        style={{ maxWidth: "850px" }}
      >
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Предмет</TableCell>
            <TableCell align="right">Тир</TableCell>
            <TableCell align="right">Цена Thetford</TableCell>
            <TableCell align="right">Цена Fort St</TableCell>
            <TableCell align="right">Цена Martlock</TableCell>
            {/*<TableCell align="right">Прибыль Thetford</TableCell>*/}
            {/*<TableCell align="right">Прибыль Fort St</TableCell>*/}
            {/*<TableCell align="right">Прибыль Martlock</TableCell>*/}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <Row key={row.item_id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
