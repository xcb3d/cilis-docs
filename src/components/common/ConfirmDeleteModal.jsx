import { FaTrash } from "react-icons/fa";

const ConfirmDeleteModal = ({ document, onCancel, onConfirm, isDeleting }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-medium mb-4">Confirm delete</h3>
            <p className="text-gray-600 mb-6">
                Are you sure you want to delete the document &quot;
                <span className="font-medium">{document?.title}</span>&quot;?
                <br />
                <span className="text-red-500 text-sm">
                    This action cannot be undone.
                </span>
            </p>
            <div className="flex justify-end space-x-3">
                <button
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-150 font-medium"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-150 flex items-center justify-center font-medium shadow-sm"
                    onClick={onConfirm}
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <>
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            <span>Deleting...</span>
                        </>
                    ) : (
                        <>
                            <FaTrash className="h-3 w-3 mr-2" />
                            <span>Delete document</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    </div>
);

export default ConfirmDeleteModal;
