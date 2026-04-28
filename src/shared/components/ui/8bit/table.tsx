"use client";

import "@/shared/components/ui/8bit/styles/retro.css";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import {
  Table as ShadcnTable,
  TableBody as ShadcnTableBody,
  TableCaption as ShadcnTableCaption,
  TableCell as ShadcnTableCell,
  TableFooter as ShadcnTableFooter,
  TableHead as ShadcnTableHead,
  TableHeader as ShadcnTableHeader,
  TableRow as ShadcnTableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";

export const tableVariants = cva("", {
  variants: {
    variant: {
      default: "border-foreground dark:border-ring border-y-6 p-4 py-2.5",
      borderless: "",
    },
    font: {
      normal: "",
      retro: "retro",
    },
  },
  defaultVariants: {
    font: "retro",
    variant: "default",
  },
});

const Table = React.forwardRef<
  HTMLTableElement,
  React.ComponentProps<typeof ShadcnTable> & {
    font?: VariantProps<typeof tableVariants>["font"];
    variant?: VariantProps<typeof tableVariants>["variant"];
  }
>(({ className, font, variant, ...props }, ref) => (
  <div className={cn("relative flex w-fit justify-center", tableVariants({ font, variant }))}>
    <ShadcnTable ref={ref} className={className} {...props} />

    {variant !== "borderless" && (
      <div
        className="border-foreground dark:border-ring pointer-events-none absolute inset-0 -mx-1.5 border-x-6"
        aria-hidden="true"
      />
    )}
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<typeof ShadcnTableHeader>
>(({ className, ...props }, ref) => (
  <ShadcnTableHeader
    ref={ref}
    className={cn(className, "border-foreground dark:border-ring border-b-4")}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<typeof ShadcnTableBody>
>(({ className, ...props }, ref) => (
  <ShadcnTableBody ref={ref} className={cn(className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<typeof ShadcnTableFooter>
>(({ className, ...props }, ref) => (
  <ShadcnTableFooter ref={ref} className={cn(className)} {...props} />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.ComponentProps<typeof ShadcnTableRow>>(
  ({ className, ...props }, ref) => (
    <ShadcnTableRow
      ref={ref}
      className={cn(className, "border-foreground dark:border-ring border-b-4 border-dashed")}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<typeof ShadcnTableHead>
>(({ className, ...props }, ref) => (
  <ShadcnTableHead ref={ref} className={cn(className)} {...props} />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<typeof ShadcnTableCell>
>(({ className, ...props }, ref) => (
  <ShadcnTableCell ref={ref} className={cn(className)} {...props} />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.ComponentProps<typeof ShadcnTableCaption>
>(({ className, ...props }, ref) => (
  <ShadcnTableCaption ref={ref} className={cn(className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
