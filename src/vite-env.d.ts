interface ImportMetaEnv {
  VITE_APP_AUTH_REGION: string;
  VITE_APP_AUTH_USER_POOL_ID: string;
  VITE_APP_AUTH_USER_POOL_WEB_CLIENT_ID: string;
  VITE_PP_AUTH_COOKIE_STORAGE_DOMAIN: string;
  VITE_APP_AUTH_COOKIE_STORAGE_DOMAIN: string;
  VITE_APP_API_ENDPOINT: string;
  VITE_APP_NAME: string;
  VITE_USE_USERNAME: string;
  VITE_USE_ORGANIZATION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
