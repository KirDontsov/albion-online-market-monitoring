"use client";
import { FC } from "react";
import { MuiThemeProvider } from "@/context";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import styles from "./items.module.scss";
import { Layout } from "@/containers/Layout";
import { ITEMS } from "@/shared/constants";

export const Items: FC = () => {
  return (
    <Layout>
      <MuiThemeProvider>
        <TableContainer component={Paper} className={styles.tableWrap}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Название</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ITEMS.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.label}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MuiThemeProvider>
    </Layout>
  );
};
