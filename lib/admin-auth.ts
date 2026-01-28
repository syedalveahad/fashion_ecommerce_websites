import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const adminToken = localStorage.getItem('rastalife_admin_token');
  return adminToken === 'authenticated';
};

export const setAdminAuthenticated = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('rastalife_admin_token', 'authenticated');
  }
};

export const clearAdminAuthentication = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('rastalife_admin_token');
  }
};
