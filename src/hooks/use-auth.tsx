import { Amplify, Auth } from 'aws-amplify';
import React, { createContext, useContext, useEffect, useState } from 'react';
import AwsConfigAuth from '../config/auth';
import { TFunction } from 'i18next';

Amplify.configure({ Auth: AwsConfigAuth });

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

const authContext = createContext({} as UseAuth);

export const ProvideAuth: React.FC<Props> = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = (): UseAuth => {
  return useContext(authContext);
};

const useProvideAuth = (): UseAuth => {
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
      const issuer = encodeURI('OQTOPUS');
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
