"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import Spinner from "../../common/Spinner";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import { documentService } from '@/services/documentService';
import ConfirmDeleteModal from "../../common/ConfirmDeleteModal";
import DocumentRow from "./DocumentRow";

const DocumentTable = () => {
  const { user } = useUser();
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const { ref, inView } = useInView();
  const hasDocuments = useMemo(() => documents.length > 0, [documents]);
  const dropdownRefs = useRef({});

  const fetchInitialDocuments = async () => {
    try {
      setInitialLoading(true);
      const data = await documentService.getDocuments({ page: 1, limit: 5 });
      setDocuments(data.documents);
      setHasMore(data.pagination.hasMore);
    } catch (err) {
      setError(err.message || "An error occurred when loading data");
      toast.error("Unable to load document list");
    } finally {
      setInitialLoading(false);
    }
  };

  // Fetch initial documents
  useEffect(() => {
    fetchInitialDocuments();
  }, []);

  // Load more documents when scrolling
  const loadMoreDocuments = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const data = await documentService.getDocuments({ page: page + 1, limit: 5 });

      if (data.documents.length === 0) {
        setHasMore(false);
        return;
      }

      setDocuments((prev) => [...prev, ...data.documents]);
      setPage((prev) => prev + 1);
      setHasMore(data.pagination.hasMore);
    } catch (error) {
      console.error("Error loading more documents:", error);
      setError("An error occurred when loading more data");
      toast.error("Unable to load more documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inView) {
      loadMoreDocuments();
    }
  }, [inView]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        openDropdownId &&
        dropdownRefs.current[openDropdownId] &&
        !dropdownRefs.current[openDropdownId].contains(event.target)
      ) {
        setOpenDropdownId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);



  // Handle click on row to navigate
  const handleRowClick = useCallback((documentId) => {
    router.push(`/document/${documentId}`);
  }, [router]);

  // Toggle dropdown menu
  const toggleDropdown = useCallback((e, documentId) => {
    e.stopPropagation();
    setOpenDropdownId(documentId);
  }, [openDropdownId]);

  // Show delete confirmation modal
  const handleDeleteClick = (e, document) => {
    e.stopPropagation(); // Prevent click event from propagating
    setDocumentToDelete(document);
    setShowConfirmModal(true);
    setOpenDropdownId(null); // Close dropdown
  };

  // Delete document
  const deleteDocument = async () => {
    if (!documentToDelete) return;

    const toastId = toast.loading("Deleting document...");

    try {
      setDeleteLoading(documentToDelete._id);
      await documentService.deleteDocument(documentToDelete._id);

      // Update document list after deletion
      setDocuments((prev) =>
        prev.filter((doc) => doc._id !== documentToDelete._id)
      );
      setShowConfirmModal(false);

      toast.update(toastId, {
        render: "Document deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error deleting document:", err);
      toast.update(toastId, {
        render: "Unable to delete document",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setDeleteLoading(null);
      setDocumentToDelete(null);
    }
  };

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full p-4 rounded-lg shadow-sm">
      <table className="w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-4 px-6 text-xs font-medium text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="text-center py-4 px-6 text-xs font-medium text-gray-600 uppercase tracking-wider">
              Created by
            </th>
            <th className="text-right py-4 px-6 text-xs font-medium text-gray-600 uppercase tracking-wider">
              Last accessed
            </th>
            <th className="py-4 px-6 text-xs font-medium text-gray-600 uppercase tracking-wider text-center w-16">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {documents.map((document) => (
            <DocumentRow
              key={document._id}
              document={document}
              onRowClick={handleRowClick}
              openDropdownId={openDropdownId}
              toggleDropdown={toggleDropdown}
              handleDeleteClick={handleDeleteClick}
              dropdownRefs={dropdownRefs}
              currentUserId={user?.id}
            />
          ))}
        </tbody>
      </table>

      {/* Loading indicator và intersection observer target */}
      <div ref={ref} className="w-full py-4">
        {loading && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
      </div>

      {/* Message when there is no more data */}
      {!hasMore && hasDocuments && (
        <div className="text-center pb-4 text-gray-500">
          All documents are displayed
        </div>
      )}

      {/* Message when there are no documents */}
      {!hasDocuments && !initialLoading && (
        <div className="text-center py-8 text-gray-500">
          No documents found
        </div>
      )}

      {/* Delete confirmation modal */}
      {showConfirmModal && (
        <ConfirmDeleteModal
          document={documentToDelete}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={deleteDocument}
          isDeleting={deleteLoading}
        />
      )}
    </div>
  );
};

export default DocumentTable;
