
import authApi from '../api/authApi';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants';

export const login = async (credentials) => {
  const { access, refresh } = await authApi.login(credentials);
  localStorage.setItem(AUTH_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  return { access, refresh };
};

export const register = async (userData) => {
  return await authApi.register(userData);
};



export const refreshToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) throw new Error('No refresh token available');
  
  const { access } = await authApi.refresh(refreshToken);
  localStorage.setItem(AUTH_TOKEN_KEY, access);
  return access;
};
