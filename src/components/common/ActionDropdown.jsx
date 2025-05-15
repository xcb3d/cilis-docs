"use client"

import { FaTrash } from "react-icons/fa";

const ActionDropdown = ({ documentId, document, isOpen, dropdownRef, onDelete, currentUserId }) => {
    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 overflow-hidden"
            style={{ top: "100%", right: "1rem" }}
        >
            <div>
                <button
                    className="flex items-center w-full px-4 py-3 text-sm text-left text-red-600 hover:bg-gray-50 transition-colors duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(e, document);
                    }}
                    disabled={currentUserId !== document.creatorId}
                >
                    <FaTrash className="mr-3 h-4 w-4" />
                    <span>Xóa tài liệu</span>
                </button>
            </div>
        </div>
    );
};

export default ActionDropdown;