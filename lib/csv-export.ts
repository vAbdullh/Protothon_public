/**
 * Converts an array of objects to CSV format
 * @param data Array of objects to convert
 * @param columns Column definitions to include in export
 * @returns CSV string
 */
function convertToCSV<T>(
  data: T[],
  columns: { key: keyof T; label: string; type: string }[]
): string {
  // Filter out button columns and get only exportable columns
  const exportableColumns = columns.filter((col) => col.type !== "button");

  // Create CSV header
  const headers = exportableColumns.map((col) => `"${col.label}"`).join(",");

  // Create CSV rows
  const rows = data.map((item) => {
    return exportableColumns
      .map((col) => {
        const value = item[col.key];
        // Handle various value types and ensure proper CSV formatting
        if (value === null || value === undefined) {
          return '""';
        }
        if (typeof value === "string") {
          // Escape quotes and wrap in quotes
          return `"${value.replace(/"/g, '""')}"`;
        }
        if (typeof value === "number" || typeof value === "boolean") {
          return String(value);
        }
        if (value instanceof Date) {
          return `"${value.toISOString()}"`;
        }
        // For objects or arrays, stringify them
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      })
      .join(",");
  });

  return [headers, ...rows].join("\n");
}

/**
 * Triggers download of a CSV file
 * @param csvContent CSV string content
 * @param filename Name of the file to download
 */
function downloadCSV(csvContent: string, filename: string): void {
  // Add UTF-8 BOM to handle Arabic characters correctly
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToCSV<T>(
  data: T[],
  columns: { key: keyof T; label: string; type: string }[],
  filename: string = `export-${new Date().toISOString().split("T")[0]}.csv`
): void {
  if (data.length === 0) {
    console.warn("No data available to export.");
    return;
  } 
  const csvContent = convertToCSV(data, columns);
  downloadCSV(csvContent, filename);
}
