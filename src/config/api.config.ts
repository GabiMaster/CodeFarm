export const API_CONFIG = {
  BASE_URL: 'https://us-central1-codefarm-9eab9.cloudfunctions.net/api',
  TIMEOUT: 15000,
};

export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  PROJECTS: {
    CREATE: '/projects',
    GET_BY_USER: (userId: string) => `/projects/user/${userId}`,
    GET_BY_ID: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
  },
  FILES: {
    CREATE: '/files',
    GET_BY_PROJECT: (projectId: string) => `/files/project/${projectId}`,
    UPDATE: (id: string) => `/files/${id}`,
    DELETE: (id: string) => `/files/${id}`,
  },
  USERS: {
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
  },
  NOTIFICATIONS: {
    GET: (userId: string) => `/notifications/${userId}`,
  },
  COLLABORATORS: {
    ADD: '/collaborators',
    GET_BY_PROJECT: (projectId: string) => `/collaborators/project/${projectId}`,
    GET_USER_COLLABORATIONS: (userId: string) => `/collaborators/user/${userId}`,
    UPDATE_ROLE: (collaboratorId: string) => `/collaborators/${collaboratorId}`,
    DELETE: (collaboratorId: string) => `/collaborators/${collaboratorId}`,
  },
  COMMENTS: {
    CREATE: '/comments',
    GET_BY_FILE: (fileId: string) => `/comments/file/${fileId}`,
    UPDATE: (commentId: string) => `/comments/${commentId}`,
    DELETE: (commentId: string) => `/comments/${commentId}`,
  },
  EXECUTIONS: {
    EXECUTE: '/executions/execute',
    GET_BY_PROJECT: (projectId: string) => `/executions/project/${projectId}`,
    GET_ALL: (userId: string) => `/executions/${userId}`,
  },
  VERSIONS: {
    CREATE: '/versions',
    GET_BY_FILE: (fileId: string) => `/versions/file/${fileId}`,
    RESTORE: (versionId: string) => `/versions/${versionId}/restore`,
  },
};