import React from "react";
import CardMenu from "components/card/CardMenu";
import { DiApple } from "react-icons/di";
import { DiAndroid } from "react-icons/di";
import { DiWindows } from "react-icons/di";
import Card from "components/card";
import Progress from "components/progress";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

type RowObj = {
  name: string;
  tech: any;
  date: string;
  progress: number;
};

function CheckTable(props: { tableData: any }) {

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>

    </Card>
  );
}

export default CheckTable;
const columnHelper = createColumnHelper<RowObj>();
