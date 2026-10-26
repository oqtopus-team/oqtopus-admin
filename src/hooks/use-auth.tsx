import { Amplify, Auth } from 'aws-amplify';
import React, { createContext, useContext, useEffect, useState } from 'react';
import AwsConfigAuth from '../config/auth';
import { TFunction } from 'i18next';

interface UseAuth {
  isLoading: boolean;
  isAuthenticated: boolean;
  username: string;
  email: string;
  idToken: string;
  qrcode: string;
  signIn: (username: string, password: string, t: TFunction<'translation', any>) => Promise<Result>;
  signOut: (t: TFunction<'translation', any>) => Promise<Result>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    t: TFunction<'translation', any>
  ) => Promise<Result>;
  firstChangePassword: (
    username: string,
    currentPassword: string,
    newPassword: string,
    t: TFunction<'translation', any>
  ) => Promise<Result>;
  setUpMfa: (t: TFunction<'translation', any>) => Promise<Result>;
  confirmMfa: (totpCode: string, t: TFunction<'translation', any>) => Promise<Result>;
  confirmSignIn: (totpCode: string, t: TFunction<'translation', any>) => Promise<Result>;
}

interface Result {
  success: boolean;
  message: string;
}

interface Props {
  children?: React.ReactNode;
}

// Build-time selection of the auth driver (Vite inlines VITE_APP_*):
//   "cognito" (default): AWS Amplify / Cognito, the SPA holds the id token.
//   "proxy"            : a reverse proxy (oauth2-proxy) owns authentication; the
//                        SPA holds no token and talks to the API same-origin
//                        with the proxy's session cookie.
export const isProxyMode = import.meta.env.VITE_APP_AUTH_MODE === 'proxy';

// Amplify is only needed by the cognito driver; don't configure it in proxy mode
// (the Cognito env vars are unset there).
if (!isProxyMode) {
  Amplify.configure({ Auth: AwsConfigAuth });
}

const authContext = createContext({} as UseAuth);

// Each driver is its own provider component so its hook is called
// unconditionally (Rules of Hooks); ProvideAuth picks one at build time.
const CognitoProvider: React.FC<Props> = ({ children }) => {
  const auth = useCognitoAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

const ProxyProvider: React.FC<Props> = ({ children }) => {
  const auth = useProxyAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const ProvideAuth: React.FC<Props> = ({ children }) =>
  isProxyMode ? (
    <ProxyProvider>{children}</ProxyProvider>
  ) : (
    <CognitoProvider>{children}</CognitoProvider>
  );

export const useAuth = (): UseAuth => {
  return useContext(authContext);
};

// ── proxy (BFF) driver ───────────────────────────────────────────────────────
// A reverse proxy (oauth2-proxy) sits in front of the SPA and Admin API and owns
// the whole authentication lifecycle. The browser holds only the proxy's session
// cookie, never an OIDC token. So login/logout are redirects, "am I logged in"
// is answered by GET /oauth2/userinfo, API calls carry no Authorization header
// (the proxy injects the Bearer upstream), and password/MFA are managed by the
// IdP (Keycloak) -- not here.
const OAUTH2_USERINFO = '/oauth2/userinfo';
const OAUTH2_START = '/oauth2/start';
const LOGOUT = '/logout';

const useProxyAuth = (): UseAuth => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetch(OAUTH2_USERINFO, { credentials: 'include' })
      .then(async (res) => {
        if (res.ok) {
          const info = await res.json();
          setEmail(info.email ?? '');
          setUsername(info.preferredUsername ?? info.user ?? info.email ?? '');
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsLoading(false));
  }, []);

  const redirectToLogin = (): void => {
    const rd = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `${OAUTH2_START}?rd=${rd}`;
  };

  const notSupported = async (): Promise<Result> => ({
    success: false,
    message: 'auth.proxy.operation_delegated_to_idp',
  });

  return {
    isLoading,
    isAuthenticated,
    username,
    email,
    idToken: '',
    qrcode: '',
    signIn: async (): Promise<Result> => {
      redirectToLogin();
      return { success: true, message: '' };
    },
    signOut: async (): Promise<Result> => {
      // Full logout is handled server-side at /logout (ends the IdP session and
      // clears the oauth2-proxy session cookie).
      window.location.href = LOGOUT;
      return { success: true, message: '' };
    },
    // Password and MFA are managed in the IdP (Keycloak) in proxy mode.
    changePassword: notSupported,
    firstChangePassword: notSupported,
    setUpMfa: notSupported,
    confirmMfa: notSupported,
    confirmSignIn: notSupported,
  };
};

// ── cognito (AWS/Amplify) driver ─────────────────────────────────────────────

const useCognitoAuth = (): UseAuth => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [idToken, setIdToken] = useState('');
  const [qrcode, setQRCode] = useState('');
  const [resultUser, setresultUser] = useState<any>(null);

  const refreshAuthState = async () => {
    try {
      const result = await Auth.currentAuthenticatedUser();
      setIdToken(result.signInUserSession.idToken.jwtToken);
      setUsername(result.username);
      setEmail(result.attributes.email);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch {
      setIdToken('');
      setUsername('');
      setEmail('');
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAuthState();
  }, []);

  const signIn = async (
    username: string,
    password: string,
    t: TFunction<'translation', any>
  ): Promise<Result> => {
    try {
      setIsAuthenticated(false);
      const result = await Auth.signIn(username, password);
      setresultUser(result);
      const hasChallenge = Object.prototype.hasOwnProperty.call(result, 'challengeName');
      if (hasChallenge) {
        if (result.challengeName === 'NEW_PASSWORD_REQUIRED') {
          return { success: false, message: t('auth.signin.require_password_change') };
        } else if (result.challengeName === 'SOFTWARE_TOKEN_MFA') {
          return { success: true, message: t('') };
        }
      }
      if (!hasChallenge) {
        return { success: false, message: t('auth.signin.require_mfa_setup') };
      }
      return { success: true, message: '' };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: t('auth.signin.auth_failed'),
      };
    }
  };

  const signOut = async (t: TFunction<'translation', any>): Promise<Result> => {
    try {
      await Auth.signOut();
      setUsername('');
      setEmail('');
      setIsAuthenticated(false);
      setIsLoading(false);
      return { success: true, message: '' };
    } catch (error) {
      return {
        success: false,
        message: t('auth.signout.signout_failed'),
      };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    t: TFunction<'translation', any>
  ): Promise<Result> => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(user, currentPassword, newPassword);
      return { success: true, message: '' };
    } catch (error) {
      return {
        success: false,
        message: t('auth.password_change.fail'),
      };
    }
  };

  const firstChangePassword = async (
    username: string,
    currentPassword: string,
    newPassword: string,
    t: TFunction<'translation', any>
  ): Promise<Result> => {
    try {
      setIsAuthenticated(false);
      await Auth.signIn(username, currentPassword).then(async (user) => {
        await Auth.completeNewPassword(user, newPassword).then((result) => {
          setresultUser(result);
          setUsername(result.username);
          setEmail(result.challengeParam.userAttributes.email);
        });
      });
      return { success: true, message: '' };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: t('auth.password_change.fail'),
      };
    }
  };

  const setUpMfa = async (t: TFunction<'translation', any>): Promise<Result> => {
    try {
      setIsAuthenticated(false);
      const user = resultUser;
      const token = await Auth.setupTOTP(user);
      const issuer = encodeURI('OQTOPUS Admin');
      const username: string = user.username;
      const code =
        'otpauth://totp/' + issuer + ':' + username + '?secret=' + token + '&issuer=' + issuer;
      setQRCode(code);
      return { success: true, message: '' };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: t('auth.mfa.error_alert.failed_get_setup_info'),
      };
    }
  };

  const confirmMfa = async (
    totpCode: string,
    t: TFunction<'translation', any>
  ): Promise<Result> => {
    try {
      await Auth.verifyTotpToken(resultUser, totpCode);
      await Auth.setPreferredMFA(resultUser, 'TOTP');
      await refreshAuthState();
      return { success: true, message: '' };
    } catch (error) {
      setIsAuthenticated(false);
      console.error(error);
      return {
        success: false,
        message: t('auth.mfa.error_alert.error_totp_code'),
      };
    }
  };
  const confirmSignIn = async (
    totpCode: string,
    t: TFunction<'translation', any>
  ): Promise<Result> => {
    try {
      const result = await Auth.confirmSignIn(resultUser, totpCode, 'SOFTWARE_TOKEN_MFA');
      await refreshAuthState();
      return { success: true, message: '' };
    } catch (error) {
      setIsAuthenticated(false);
      console.error(error);
      return {
        success: false,
        message: t('auth.mfa.error_alert.error_totp_code'),
      };
    }
  };

  return {
    isLoading,
    isAuthenticated,
    username,
    email,
    idToken,
    qrcode,
    signIn,
    signOut,
    changePassword,
    firstChangePassword,
    setUpMfa,
    confirmMfa,
    confirmSignIn,
  };
};
