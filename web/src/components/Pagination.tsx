import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalRecords,
  pageSize,
  onPageChange
}: PaginationProps) {
  const totalPages = Math.ceil(totalRecords / pageSize);
  
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-light)' }}>
        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} entries
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          className="btn btn-outline" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={{ padding: '6px 12px' }}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <button 
          className="btn btn-primary"
          style={{ padding: '6px 12px' }}
        >
          {currentPage}
        </button>
        <button 
          className="btn btn-outline" 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={{ padding: '6px 12px' }}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
