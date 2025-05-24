import React, { useState } from "react";
import { Table } from "lucide-react";
import ToolbarButton from "@/components/common/ToolbarButton";

const TableInserter = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredCell, setHoveredCell] = useState({ row: 0, col: 0 });
  const GRID_SIZE = 8;

  const handleMouseEnter = (row, col) => {
    setHoveredCell({ row, col });
  };

  const handleClick = () => {
    const size = {
      rows: hoveredCell.row + 1,
      cols: hoveredCell.col + 1,
    };
    editor.chain().focus().insertTable({ rows: size.rows, cols: size.cols, withHeaderRow: true }).run()
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <ToolbarButton icon={Table} onClick={() => setIsOpen(true)} label={"Insert table"}/>

      {isOpen && (
        <>
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          <div
            className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-lg border
                        border-gray-100 p-4 w-[320px] z-50"
          >
            <div className="mb-3 text-sm text-gray-600 font-medium">
              {hoveredCell.row > 0 && hoveredCell.col > 0
                ? `${hoveredCell.row + 1} × ${hoveredCell.col + 1} table`
                : "Hover to select table size"}
            </div>

            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                const row = Math.floor(index / GRID_SIZE);
                const col = index % GRID_SIZE;
                const isHighlighted =
                  row <= hoveredCell.row && col <= hoveredCell.col;

                return (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-sm cursor-pointer transition-all duration-150
                      ${
                        isHighlighted
                          ? "bg-blue-50 border-2 border-blue-200"
                          : "bg-gray-50 border border-gray-200 hover:border-gray-300"
                      }`}
                    onMouseEnter={() => handleMouseEnter(row, col)}
                    onClick={handleClick}
                  />
                );
              })}
            </div>

            <div className="mt-3 text-xs text-gray-400">Click to insert table</div>
          </div>
        </>
      )}
    </div>
  );
};

export default TableInserter;
