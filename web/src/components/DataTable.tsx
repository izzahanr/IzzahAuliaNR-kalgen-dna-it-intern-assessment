import React from 'react';

interface Column {
  key: string;
  label: string;
  render?: (val: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
}

export default function DataTable({ columns, data, loading = false }: DataTableProps) {
  return (
    <div style={{ overflowX: 'auto', backgroundColor: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: 'var(--primary-color)', color: 'var(--white)' }}>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>
                Loading data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row, rIdx) => (
              <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                {columns.map((col, cIdx) => (
                  <td key={cIdx} style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--text-dark)' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
