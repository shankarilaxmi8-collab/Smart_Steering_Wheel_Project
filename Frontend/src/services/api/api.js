const BASE_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname || "localhost"}:8000`;

export async function getDriverStatus() {
  const response = await fetch(
    `${BASE_URL}/api/v1/status`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch driver status");
  }

  return await response.json();
}
