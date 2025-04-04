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

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((result) => {
        setIdToken(result.signInUserSession.idToken.jwtToken);
        setUsername(result.username);
        setEmail(result.attributes.email);
        setIsAuthenticated(true);
        setIsLoading(false);
      })
      .catch(() => {
        setIdToken('');
        setUsername('');
        setEmail('');
        setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, []);

  const signIn = async (
    username: string,
    password: string,
    t: TFunction<'translation', any>
  ): Promise<Result> => {
    try {
      const result = await Auth.signIn(username, password);
      if (result.challengeName === 'NEW_PASSWORD_REQUIRED') {
        return { success: false, message: t('auth.signin.require_password_change') };
      }
      setUsername(result.username);
      setEmail(result.attributes.email);
      setIdToken(result.signInUserSession.idToken.jwtToken);
      setIsAuthenticated(true);
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
      await Auth.signIn(username, currentPassword).then(async (user) => {
        await Auth.completeNewPassword(user, newPassword).then((result) => {
          setUsername(result.username);
          setEmail(result.challengeParam.userAttributes.email);
          setIsAuthenticated(true);
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

  return {
    isLoading,
    isAuthenticated,
    username,
    email,
    idToken,
    signIn,
    signOut,
    changePassword,
    firstChangePassword,
  };
};
