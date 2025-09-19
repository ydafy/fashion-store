export interface PhoneData {
  number: string; // El número nacional, ej: "6623173255"
  countryCode: string; // El código de 2 letras, ej: "MX"
  callingCode: string; // El código de llamada, ej: "52"
}
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: PhoneData;
  password?: string;
  isEmailVerified?: boolean;
  avatarUrl?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

// Define qué valores proveerá el AuthContext
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // ✨ RESTAURADO: Las funciones que pueden fallar devuelven Promise<boolean>
  requestPasswordReset: (email: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  simulateSocialLogin: (provider: 'google' | 'facebook') => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;

  logout: () => Promise<void>;
  simulateEmailVerification: () => Promise<void>;
  updateUser: (updatedUserData: User) => Promise<void>;
  clearAuthError: () => void;
}
