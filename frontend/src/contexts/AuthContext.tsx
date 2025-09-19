import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

import { User, AuthContextType } from '../types/auth';
import * as authService from '../services/auth';
import { processUnknownError } from '../utils/errorUtils';

const USER_TOKEN_KEY = '@user_token';
const USER_DATA_KEY = '@user_data';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation(['auth', 'common', 'errors']);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearAuthError = useCallback(() => setError(null), []);

  const handleSuccessfulAuth = useCallback(
    async (userData: User, userToken: string) => {
      setUser(userData);
      setToken(userToken);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(USER_TOKEN_KEY, userToken);
    },
    [],
  );

  const simulateSocialLogin = useCallback(
    async (provider: 'google' | 'facebook'): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula demora

        const socialUser: User = {
          id: `social-${provider}-${Date.now()}`,
          name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
          email: `${provider}user@example.com`,
          isEmailVerified: true, // Los logins sociales suelen venir verificados
        };
        const socialToken = `fake-social-jwt-for-${socialUser.id}`;

        await handleSuccessfulAuth(socialUser, socialToken);
        return true;
      } catch (e: any) {
        const errorMessage = String(
          t('auth:alerts.socialLoginError', { provider }),
        );
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [t, handleSuccessfulAuth],
  );

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const { user: userData, token: userToken } = await authService.login({
          email,
          password,
        });
        await handleSuccessfulAuth(userData, userToken);
        return true;
      } catch (e) {
        const { messageKey, fallbackMessage } = processUnknownError(e);
        const i18nKey = messageKey.replace('.', ':');
        const errorMessage = String(t(i18nKey, fallbackMessage));
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [t, handleSuccessfulAuth],
  );

  const register = useCallback(
    // ✨ LINTER FIX: Eliminado el parámetro 'phone'
    async (name: string, email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const { user: userData, token: userToken } = await authService.register(
          // ✨ LINTER FIX: Eliminado 'phone' del payload
          { name, email, password },
        );
        await handleSuccessfulAuth(userData, userToken);
        return true;
      } catch (e) {
        // ✨ LINTER FIX: Eliminado ': any'
        const error = e as any;
        const errorMessage = String(
          t(
            error.messageKey || 'common:genericError',
            error.message || 'An error occurred',
          ),
        );
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [t, handleSuccessfulAuth],
  );

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setUser(null);
    setToken(null);
    try {
      await AsyncStorage.multiRemove([USER_TOKEN_KEY, USER_DATA_KEY]);
    } catch (e) {
      console.error('[AuthContext] Error removing user data from storage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(
    async (updatedUserData: User): Promise<void> => {
      setUser(updatedUserData);
      try {
        await AsyncStorage.setItem(
          USER_DATA_KEY,
          JSON.stringify(updatedUserData),
        );
      } catch (e) {
        console.error('[AuthContext] Error updating user data in storage', e);
      }
    },
    [],
  );

  const requestPasswordReset = useCallback(
    async (email: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        await authService.requestPasswordReset(email);
        return true;
      } catch (e: any) {
        const errorMessage = String(
          t(
            e.messageKey || 'common.genericError',
            e.message || 'An error occurred',
          ),
        );
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const resendVerificationEmail = useCallback(async (): Promise<boolean> => {
    if (!user?.email) return false;
    // No ponemos isLoading aquí para que no bloquee la UI
    try {
      await authService.resendVerificationEmail(user.email);
      return true;
    } catch (e: any) {
      setError(
        t('errors:auth.resendFailed', 'Failed to resend verification email.'),
      );
      return false;
    }
  }, [user?.email, t]);

  const simulateEmailVerification = useCallback(async (): Promise<void> => {
    if (!user) return;
    const updatedUser: User = { ...user, isEmailVerified: true };
    setUser(updatedUser);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
  }, [user]);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userToken = await AsyncStorage.getItem(USER_TOKEN_KEY);
        const userDataString = await AsyncStorage.getItem(USER_DATA_KEY);
        if (userToken && userDataString) {
          const storedUser: User = JSON.parse(userDataString);
          setUser(storedUser);
          setToken(userToken);
        }
      } catch (e) {
        console.error('[AuthContext] Restoring token/user failed', e);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrapAsync();
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token, // La autenticación ahora se deriva directamente de la existencia de un token
      isLoading,
      error,
      login,
      register,
      logout,
      requestPasswordReset,
      resendVerificationEmail,
      simulateSocialLogin,
      simulateEmailVerification,
      clearAuthError,
      updateUser,
    }),
    [
      user,
      token,
      isLoading,
      error,
      login,
      register,
      logout,
      requestPasswordReset,
      resendVerificationEmail,
      simulateEmailVerification,
      clearAuthError,
      simulateSocialLogin,
      updateUser,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
