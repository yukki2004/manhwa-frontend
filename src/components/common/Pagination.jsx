import React from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const Pagination = ({ pageIndex, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-10">
      <button
        onClick={() => onPageChange(pageIndex - 1)}
        disabled={pageIndex === 1}
        className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white disabled:opacity-20 transition-all border border-white/5"
      >
        <IoChevronBack size={20} />
      </button>

      <div className="flex items-center gap-2">
        <span className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-600/20">
          TRANG {pageIndex} / {totalPages}
        </span>
      </div>

      <button
        onClick={() => onPageChange(pageIndex + 1)}
        disabled={pageIndex === totalPages}
        className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white disabled:opacity-20 transition-all border border-white/5"
      >
        <IoChevronForward size={20} />
      </button>
    </div>
  );
};

export default Pagination;