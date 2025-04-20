import React, { JSX } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationUI: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null; // Hide pagination if only one page exists

  const renderPaginationItems = () => {
    const items: JSX.Element[] = [];

    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i} className="cursor-pointer">
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem className="cursor-pointer">
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {renderPaginationItems()}

        <PaginationItem className="cursor-pointer">
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationUI;
