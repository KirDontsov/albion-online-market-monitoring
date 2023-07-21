"use client";
import {
  ChangeEvent,
  MouseEvent,
  FC,
  useMemo,
  useState,
  memo,
  useCallback,
} from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import type { Data } from "@/shared";
import uniqueId from "lodash/uniqueId";
import { CITIES, ITEMS } from "@/shared/constants";
import dayjs from "dayjs";

import styles from "./custom-table.module.scss";

export const PRICE_DIFF = 2000;
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "item_id",
    numeric: false,
    disablePadding: true,
    label: "Название товара",
  },
  {
    id: "city",
    numeric: false,
    disablePadding: false,
    label: "Город",
  },
  {
    id: "quality",
    numeric: true,
    disablePadding: false,
    label: "Качество",
  },
  {
    id: "sell_price_min",
    numeric: true,
    disablePadding: false,
    label: "Цена продажи min",
  },
  {
    id: "sell_price_max",
    numeric: true,
    disablePadding: false,
    label: "Цена продажи max",
  },
  {
    id: "buy_price_min",
    numeric: true,
    disablePadding: false,
    label: "Цена покупки min",
  },
  {
    id: "buy_price_max",
    numeric: true,
    disablePadding: false,
    label: "Цена покупки max",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar({ numSelected }: EnhancedTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Мониторинг
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export interface CustomTableProps {
  data: Data[];
}

// eslint-disable-next-line react/display-name
export const CustomTable: FC<CustomTableProps> = memo(({ data }) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("item_id");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page] = useState(0);
  const [rowsPerPage] = useState(5);

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data?.map((n) => n.item_id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = useMemo(
    () => stableSort(data, getComparator(order, orderBy)),
    [data, order, orderBy]
  );

  const handleClickCell = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.item_id);
                const labelId = `enhanced-table-checkbox-${index}`;

                if (
                  !row.sell_price_min &&
                  !row.sell_price_max &&
                  !row.buy_price_min &&
                  !row.buy_price_max
                ) {
                  return null;
                }

                return (
                  <TableRow
                    hover
                    // onClick={(event) => handleClick(event, row.item_id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={uniqueId()}
                    selected={isItemSelected}
                    sx={{
                      cursor: "pointer",
                      background:
                        row.buy_price_max !== 0 &&
                        row.sell_price_min > row.buy_price_max + PRICE_DIFF
                          ? "#9FEE00aa"
                          : "white",
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      onClick={() =>
                        handleClickCell(
                          ITEMS.find((x) => x.id === row.item_id)?.label ?? ""
                        )
                      }
                    >
                      {ITEMS.find((x) => x.id === row.item_id)?.label}
                    </TableCell>
                    <TableCell
                      onClick={() =>
                        handleClickCell(
                          CITIES.find((x) => x.value === row.city)?.label ?? ""
                        )
                      }
                    >
                      {CITIES.find((x) => x.value === row.city)?.label}
                    </TableCell>
                    <TableCell align="right">{row.quality}</TableCell>
                    <TableCell
                      align="right"
                      onClick={() => handleClickCell(`${row.sell_price_min}`)}
                    >
                      <div className={styles.tableCellWrapper}>
                        <span>{row.sell_price_min}</span>
                        {row.sell_price_min !== 0 && (
                          <span>
                            {dayjs(row.sell_price_min_date).format(
                              "DD.MM.YYYY"
                            )}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={() => handleClickCell(`${row.sell_price_max}`)}
                    >
                      <div className={styles.tableCellWrapper}>
                        <span>{row.sell_price_max}</span>
                        {row.sell_price_max !== 0 && (
                          <span>
                            {dayjs(row.sell_price_max_date).format(
                              "DD.MM.YYYY"
                            )}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={() => handleClickCell(`${row.buy_price_min}`)}
                    >
                      <div className={styles.tableCellWrapper}>
                        <span>{row.buy_price_min}</span>
                        {row.buy_price_min !== 0 && (
                          <span>
                            {dayjs(row.buy_price_min_date).format("DD.MM.YYYY")}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={() => handleClickCell(`${row.buy_price_max}`)}
                    >
                      <div className={styles.tableCellWrapper}>
                        <span>{row.buy_price_max}</span>
                        {row.buy_price_max !== 0 && (
                          <span>
                            {dayjs(row.buy_price_max_date).format("DD.MM.YYYY")}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
});
