"use client";

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
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import "@/components/ui/8bit/styles/retro.css";

export const tableVariants = cva("", {
  variants: {
    variant: {
      default: "p-4 py-2.5 border-y-6 border-foreground dark:border-ring",
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
  <div
    className={cn(
      "relative flex justify-center w-fit",
      tableVariants({ font, variant }),
    )}
  >
    <ShadcnTable ref={ref} className={className} {...props} />

    {variant !== "borderless" && (
      <div
        className="absolute inset-0 border-x-6 -mx-1.5 border-foreground dark:border-ring pointer-events-none"
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
    className={cn(className, "border-b-4 border-foreground dark:border-ring")}
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

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.ComponentProps<typeof ShadcnTableRow>
>(({ className, ...props }, ref) => (
  <ShadcnTableRow
    ref={ref}
    className={cn(
      className,
      "border-dashed border-b-4 border-foreground dark:border-ring",
    )}
    {...props}
  />
));
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

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
