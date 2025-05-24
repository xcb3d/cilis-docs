// hooks/useDocumentData.js
import { useEffect, useState } from 'react';

export function useDocumentData(roomId) {
  const [documentData, setDocumentData] = useState({ title: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/document/${roomId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "An error occurred when loading document data");
        }

        setDocumentData({ title: data.title });
      } catch (error) {
        console.error("Error fetching document data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (roomId) {
      fetchDocumentData();
    }
  }, [roomId]);

  return { documentData, isLoading, error };
}