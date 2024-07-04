import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login, register, refreshToken } from '../services/authService';
import authApi from '../api/authApi';
import { getUserData as fetchUserData } from '../services/userService';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants';

const initialState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  current_otp_user: null,
  reset_token: null,
  teachingClasses: [],
  enrolledClasses: [],
};

const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,

      setResetToken: async (token) => {
        set({ reset_token: token });
      },

      setCurrentOtpUser: async (email) => {
        set({ current_otp_user: email });
      },

      fetchUserDataAndUpdateStore: async () => {
        let user = null;
        try {
          user = await fetchUserData();
          localStorage.setItem("User", JSON.stringify(user));
          const isAdmin = user.is_superuser; // Store user data in local storage
          set({ user, isAuthenticated: true, isAdmin });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
        return user;
      },

      login: async (credentials) => {
        try {
          const { access, refresh } = await login(credentials);
          set({ accessToken: access, refreshToken: refresh });
          const user = await useAuthStore.getState().fetchUserDataAndUpdateStore();
          console.log(user);
          if (user.is_blocked) {
            throw new Error('User is blocked. Please contact support for assistance.');
          }
        } catch (error) {
          console.error('Login failed:', error);
          throw error; // Rethrow the error for handling in the component
        }
      },

      register: async (userData) => {
        const response = await register(userData);
        return response.data;
      },

      logout: async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        console.log(refreshToken);
        await authApi.logout(refreshToken);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem("User");
        set({ ...initialState });
      },

      refreshAccessToken: async () => {
        try {
          const accessToken = await refreshToken();
          fetchUserData();
          set({ accessToken });
        } catch (error) {
          console.error('Failed to refresh access token:', error);
          set({ accessToken: null, user: null, isAuthenticated: false, isAdmin: false });
        }
      },
    }),
    {
      name: 'auth-storage', // unique name for storage key
      getStorage: () => localStorage, // specify the storage medium
    }
  )
);

console.log("auth store:");

export default useAuthStore;
