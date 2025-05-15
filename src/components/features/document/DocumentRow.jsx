import Image from "next/image";
import { FaFileAlt, FaClock, FaUser, FaEllipsisV } from "react-icons/fa";
import ActionDropdown from "../../common/ActionDropdown";
import { formatTime } from "@/utils/algrithm";

const DocumentRow = ({
    document,
    onRowClick,
    openDropdownId,
    toggleDropdown,
    handleDeleteClick,
    dropdownRef,
    currentUserId
}) => (
    <tr
        className="transition-colors duration-200 hover:bg-gray-50 cursor-pointer"
        onClick={() => onRowClick(document._id)}
    >
        <td className="py-4 px-6">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-gray-100">
                    <FaFileAlt className="h-5 w-5 text-gray-500" />
                </div>
                <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                        {document.title}
                    </div>
                    <div className="text-xs text-gray-500">
                        {document.description || "No description"}
                    </div>
                </div>
            </div>
        </td>
        <td className="py-4 px-6">
            <div className="flex items-center justify-center">
                {document.creator?.imageUrl ? (
                    <div className="h-8 w-8 rounded-full overflow-hidden relative mr-2">
                        <Image
                            src={document.creator.imageUrl}
                            alt={document.creator.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        <FaUser className="h-4 w-4 text-gray-500" />
                    </div>
                )}
                <span className="text-sm text-gray-700">
                    {document.creator?.name || "Unknown"}
                </span>
            </div>
        </td>
        <td className="py-4 px-6 text-right">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full flex items-center justify-end space-x-1">
                <FaClock className="h-3 w-3" />
                <span>{formatTime(document.lastAccessed)}</span>
            </span>
        </td>
        <td className="py-4 px-6 text-center relative">
            <button
                className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                onClick={(e) => toggleDropdown(e, document._id)}
            >
                <FaEllipsisV className="h-4 w-4 text-gray-500" />
            </button>

            <ActionDropdown
                documentId={document._id}
                document={document}
                isOpen={openDropdownId === document._id}
                toggleDropdown={toggleDropdown}
                dropdownRefs={dropdownRef}
                onDelete={handleDeleteClick}
                currentUserId={currentUserId}
            />
        </td>
    </tr>
);

export default DocumentRow;