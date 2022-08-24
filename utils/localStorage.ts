const STORAGE_KEY = "lizard-token";

export const getToken = () => global.localStorage?.getItem(STORAGE_KEY);
export const setToken = (token: string) =>
  global.localStorage?.setItem(STORAGE_KEY, token);
