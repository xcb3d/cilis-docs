export const API_ENDPOINTS = {
  DOCUMENTS: {
    LIST: '/document',
    DETAIL: (id) => `/document/${id}`,
    ACCESS: '/document/access',
    DELETE: (id) => `/document/${id}`,
  },
  LIVEBLOCK: {
    AUTH: '/liveblock/auth',
    CREATE_ROOM: '/liveblock/createRoom',
    DELETE_ROOM: '/liveblock/deleteRoom',
  },
  USERS: {
    INFO: '/user/info',
    MENTION: '/user/mention',
  },
};

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

export const API_HEADERS = {
  JSON: {
    'Content-Type': 'application/json',
  },
};