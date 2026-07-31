const BASE_URL =
  "https://laughing-winner-967w7jxq9rggf95qx-8000.app.github.dev";

export async function getDriverStatus() {
  const response = await fetch(`${BASE_URL}/api/v1/status`);

  if (!response.ok) {
    throw new Error("Failed to fetch driver status");
  }

  return await response.json();
}