import { API_ENDPOINTS, API_METHODS, API_HEADERS } from '@/constants/api';
import axiosInstance from '@/lib/axios';

export const documentService = {
  // Lấy danh sách documents
  async getDocuments({ page = 1, limit = 5 }) {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.DOCUMENTS.LIST, {
        params: {
          page,
          limit
        },
        cache: {
          maxAge: 5 * 60 * 1000, // Cache 5 phút
          excludeFromCache: false
        }
      });

      if (response.error) {
        throw new Error('Failed to fetch documents');
      }

      return response;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  // Lấy chi tiết document
  async getDocument(id) {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.DOCUMENTS.DETAIL(id));

      if (response.error) {
        throw new Error('Failed to fetch document');
      }

      return response;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  },

  // Cập nhật document
  async updateDocument(id, newTitle) {
    try {
      const response = await axiosInstance.patch(API_ENDPOINTS.DOCUMENTS.DETAIL(id), {
        title: newTitle
      });

      if (response.error) {
        throw new Error('Failed to update document');
      }

      return response;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  // Xóa document
  async deleteDocument(id) {
    try {
      const response = await axiosInstance.delete(API_ENDPOINTS.DOCUMENTS.DELETE(id));

      if (response.error) {
        throw new Error('Failed to delete document');
      }

      return response;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Ghi lại lượt truy cập
  async recordAccess(documentId) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.DOCUMENTS.ACCESS, {
        documentId
      });

      if (response.error) {
        throw new Error('Failed to record access');
      }

      return response;
    } catch (error) {
      console.error('Error recording access:', error);
      throw error;
    }
  },
};