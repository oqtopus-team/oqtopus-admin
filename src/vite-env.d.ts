interface ImportMetaEnv {
  // Auth driver selected at build time: "cognito" (default, AWS/Amplify) or
  // "proxy" (BFF: oauth2-proxy + Keycloak, the SPA holds no token).
  VITE_APP_AUTH_MODE?: 'cognito' | 'proxy';
  // Base URL of the IdP's self-service account console (proxy mode); password
  // and MFA management are delegated there.
  VITE_APP_ACCOUNT_CONSOLE_URL?: string;
  VITE_APP_AUTH_REGION: string;
  VITE_APP_AUTH_USER_POOL_ID: string;
  VITE_APP_AUTH_USER_POOL_WEB_CLIENT_ID: string;
  VITE_APP_AUTH_COOKIE_STORAGE_DOMAIN: string;
  // In proxy mode this is the same-origin "/api" prefix the reverse proxy
  // forwards to the Admin API; required (absolute URL) in cognito mode.
  VITE_APP_API_ENDPOINT: string;
  VITE_APP_NAME: string;
  VITE_USE_USERNAME: string;
  VITE_USE_ORGANIZATION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
