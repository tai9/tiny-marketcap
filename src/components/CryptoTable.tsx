import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import Image from "next/image";
import * as React from "react";
import TableRowsLoader from "./TableRowsLoader";

const formatUsdPrice = (price: number, currency: string = "USD") => {
  const USDollar = new Intl.NumberFormat("en-US", {
    style: currency === "USD" ? "currency" : undefined,
    currency: "USD",
  });
  return `${USDollar.format(price)} ${currency !== "USD" ? currency : ""}`;
};

interface Data {
  id: string;
  cmcRank?: number;
  name: string;
  price: number;
  onehour: number;
  oneday: number;
  sevendays: number;
  marketcap: number;
  volume: number;
  circulatingSupply: number;
}

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
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "#",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "onehour",
    numeric: true,
    disablePadding: false,
    label: "1h %",
  },
  {
    id: "oneday",
    numeric: true,
    disablePadding: false,
    label: "24h %",
  },
  {
    id: "sevendays",
    numeric: true,
    disablePadding: false,
    label: "7d %",
  },
  {
    id: "marketcap",
    numeric: true,
    disablePadding: false,
    label: "Market Cap",
  },
  {
    id: "volume",
    numeric: true,
    disablePadding: false,
    label: "Volume(24h)",
  },
  {
    id: "circulatingSupply",
    numeric: true,
    disablePadding: false,
    label: "Circulating Supply",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={
              headCell.id === "id"
                ? "center"
                : headCell.numeric
                ? "right"
                : "left"
            }
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

interface Props {
  rows: any;
  total: number;
  handleViewDetail: () => void;
  rowsPerPage: number;
  loading: boolean;
}

export default function CtyptoTable({
  rows,
  total,
  loading,
  rowsPerPage,
  handleViewDetail,
}: Props) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("cmcRank");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, row: any) => {
    handleViewDetail();
    console.log(row);
    window.open(`https://coinmarketcap.com/currencies/${row.slug}/`, "_blank");
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort<any>(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows]
  );

  const getQuote = (quotes: any[], coin: "BTC" | "ETH" | "USD") => {
    return quotes.find((x: any) => x.name === coin);
  };
  const content = "\x04b";
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {loading ? (
                <TableRowsLoader cellsNum={headCells.length} />
              ) : (
                visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(index);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const btcQuote = getQuote(row.quotes, "BTC");
                  const usdQuote = getQuote(row.quotes, "USD");

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        align="center"
                        component="th"
                        id={labelId}
                        scope="row"
                      >
                        {row.cmcRank}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <Stack spacing={1} direction="row" alignItems="center">
                          <Image
                            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${row.id}.png`}
                            alt={row.symbol}
                            width={24}
                            height={24}
                            style={{
                              borderRadius: 24,
                            }}
                          />
                          <span>{row.name}</span>
                          <span
                            style={{
                              color: "#eff2f5",
                            }}
                          >
                            {row.symbol}
                          </span>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        {formatUsdPrice(usdQuote.price)}
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          justifyContent={"right"}
                        >
                          {usdQuote.percentChange1h >= 0 ? (
                            <ArrowDropUpIcon
                              style={{
                                color: "#16c784",
                              }}
                            />
                          ) : (
                            <ArrowDropDownIcon
                              style={{
                                color: "#ea3943",
                              }}
                            />
                          )}
                          <Typography
                            className="up"
                            sx={{
                              color:
                                usdQuote.percentChange1h >= 0
                                  ? "#16c784"
                                  : "#ea3943",
                            }}
                          >
                            {Math.abs(usdQuote.percentChange1h).toFixed(2)}%
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          justifyContent={"right"}
                        >
                          {usdQuote.percentChange24h >= 0 ? (
                            <ArrowDropUpIcon
                              style={{
                                color: "#16c784",
                              }}
                            />
                          ) : (
                            <ArrowDropDownIcon
                              style={{
                                color: "#ea3943",
                              }}
                            />
                          )}
                          <Typography
                            className="up"
                            sx={{
                              color:
                                usdQuote.percentChange24h >= 0
                                  ? "#16c784"
                                  : "#ea3943",
                            }}
                          >
                            {Math.abs(usdQuote.percentChange24h).toFixed(2)}%
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          justifyContent={"right"}
                        >
                          {usdQuote.percentChange7d >= 0 ? (
                            <ArrowDropUpIcon
                              style={{
                                color: "#16c784",
                              }}
                            />
                          ) : (
                            <ArrowDropDownIcon
                              style={{
                                color: "#ea3943",
                              }}
                            />
                          )}
                          <Typography
                            className="up"
                            sx={{
                              color:
                                usdQuote.percentChange7d >= 0
                                  ? "#16c784"
                                  : "#ea3943",
                            }}
                          >
                            {Math.abs(usdQuote.percentChange7d).toFixed(2)}%
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        {formatUsdPrice(usdQuote.marketCap)}
                      </TableCell>
                      <TableCell align="right">
                        <Stack>
                          <span>{formatUsdPrice(usdQuote.volume24h)}</span>
                          <Typography color={"#cfd6e4"} variant="caption">
                            {formatUsdPrice(btcQuote.volume24h, row.symbol)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        {formatUsdPrice(row.circulatingSupply, row.symbol)}{" "}
                        {row.symbol}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
