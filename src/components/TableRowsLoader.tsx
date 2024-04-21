import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Skeleton from "@mui/material/Skeleton";

type Props = {
  rowsNum?: number;
  cellsNum: number;
};

const TableRowsLoader = ({ rowsNum = 20, cellsNum }: Props) => {
  return [...Array(rowsNum)].map((row, index) => (
    <TableRow key={index}>
      {[...Array(cellsNum)].map((cell) => (
        <TableCell key={cell} component="th" scope="row">
          <Skeleton animation="wave" variant="text" height={50} />
        </TableCell>
      ))}
    </TableRow>
  ));
};

export default TableRowsLoader;
