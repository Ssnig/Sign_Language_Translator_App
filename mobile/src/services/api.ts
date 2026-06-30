import { create } from 'axios';

// TODO: Replace with actual API base URL
const BASE_URL = 'https://api.sign-language-translator.com/v1';

export const apiClient = create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// TODO: Add auth interceptor when backend is ready
apiClient.interceptors.request.use((config) => {
  // TODO: Attach bearer token from secure storage
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Handle global error responses (401, 500, etc.)
    return Promise.reject(error);
  },
);
