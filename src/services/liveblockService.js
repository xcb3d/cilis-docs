import { API_ENDPOINTS, API_METHODS, API_HEADERS } from '@/constants/api';
import axiosInstance from '@/lib/axios';

export const liveblockService = {
  // Xác thực quyền truy cập
  async authenticate(room) {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LIVEBLOCK.AUTH, {
        room
      });
      return response;
    } catch (error) {
      console.error('Error authenticating:', error);
      throw error;
    }
  },

  // Lấy thông tin users
  async resolveUsers(userIds) {
    try {
      const params = new URLSearchParams({
        userIds: userIds.join(","),
      });

      const response = await axiosInstance.get(`${API_ENDPOINTS.USERS.INFO}?${params}`);

      return response.users;
    } catch (error) {
      console.error('Error resolving users:', error);
      return [];
    }
  },

  // Lấy gợi ý mention
  async getMentionSuggestions(text, roomId) {
    try {
      const params = new URLSearchParams({
        text,
        roomId,
      });

      const response = await axiosInstance.get(`${API_ENDPOINTS.USERS.MENTION}?${params}`);
        
      return response;
    } catch (error) {
      console.error('Error getting mention suggestions:', error);
      return [];
    }
  },
};