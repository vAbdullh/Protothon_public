'use client';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { Mars, Venus } from "lucide-react";
import { useLocale } from 'next-intl';
import { Badge } from "../shadcn/badge";
import { Button } from "../shadcn/button";

type ColumnType = 'text' | 'gender' | 'date' | 'badge' | 'status' | 'button';

type TableColumn<T> = {
  key: keyof T;
  label: string;
  type: ColumnType;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  onClick?: (value: T[keyof T], row: T) => void;
  value?: string; 
  icon?: React.ComponentType;
};

type ReusableTableProps<T> = {
  caption?: string;
  columns: TableColumn<T>[];
  data: T[];
};

export function DashboardTable<T>({ caption, columns, data }: ReusableTableProps<T>) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const renderCell = (col: TableColumn<T>, value: T[keyof T], row: T) => {
    if (col.render) return col.render(value, row);

    switch (col.type) {
      case 'text':
        return value as string;
      case 'gender':
        return value === 'male' ? <Mars className="text-blue-500" /> : <Venus className="text-pink-500" />;
      case 'date':
        return new Date(value as string).toLocaleString(locale);
      case 'badge':
        return (
          <Badge variant="default">{value as string}</Badge>
        );
      case 'status':
            return (
                <span className={`inline-block px-2 py-1 rounded-sm text-xs capitalize font-semibold ${value === 'approved' ? 'bg-green-200 text-green-800' : value === 'rejected' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    {value as string}
                </span>
            )
      case 'button':
            return (
                <Button 
                  variant="outline" 
                  className="cursor-pointer"
                  onClick={() => col.onClick?.(value, row)}
                >
                  <col.icon />
                  {col?.value}
                </Button>
            )
      default:
        return value as string;
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-x-auto">
      <Table className="min-w-full divide-y divide-border">
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)} className="px-4 py-3 uppercase font-extrabold text-start">
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx} className="hover:bg-cyan-200/10 odd:bg-muted/50">
              {columns.map((col) => (
                <TableCell key={String(col.key)} className="px-4 py-2">
                  {renderCell(col, row[col.key], row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
