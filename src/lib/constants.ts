import API_BASE_URL from '../config';

export const googleLoginUrl = (): string => {
  const redirectTo = encodeURIComponent(`${window.location.origin}/auth/callback`);
  return `${API_BASE_URL}/oauth/google/login_authorize?redirect_to=${redirectTo}`;
};