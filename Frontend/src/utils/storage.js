export const DRIVER_STORAGE_KEY = "driver_profile";

export const DEFAULT_DRIVER_PROFILE = {
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    licenseNumber: "",
    emergencyName: "",
    emergencyPhone: "",
    medicalConditions: "",
    medications: "",
};

/*
|--------------------------------------------------------------------------
| DRIVER SESSION
|--------------------------------------------------------------------------
*/

export function startDriverSession() {
  localStorage.setItem("driver_session", "true");
}

export function endDriverSession() {
  localStorage.removeItem("driver_session");
}

export function isDriverLoggedIn() {
  return localStorage.getItem("driver_session") === "true";
}

export const saveDriverProfile = (profile) => {
    localStorage.setItem(
        DRIVER_STORAGE_KEY,
        JSON.stringify(profile)
    );
};

export const getDriverProfile = () => {
    const data = localStorage.getItem(DRIVER_STORAGE_KEY);

    return data
        ? JSON.parse(data)
        : null;
};

export const clearDriverProfile = () => {
    localStorage.removeItem(DRIVER_STORAGE_KEY);
};