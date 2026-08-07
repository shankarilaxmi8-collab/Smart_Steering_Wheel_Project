export const DRIVER_STORAGE_KEY = "driver_profile";

export const saveDriverProfile = (profile) => {
  localStorage.setItem(
    DRIVER_STORAGE_KEY,
    JSON.stringify(profile)
  );
};

export const getDriverProfile = () => {
  const data = localStorage.getItem(DRIVER_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearDriverProfile = () => {
  localStorage.removeItem(DRIVER_STORAGE_KEY);
};