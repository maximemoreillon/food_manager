// Validates an API key against api-key-manager (github.com/jtekt/api-key-manager).
// Configure via API_KEY_MANAGER_URL, e.g. https://api-key-manager.home.maximemoreillon.com
const baseUrl = process.env.API_KEY_MANAGER_URL;

/** Returns the owning user_id if the key is valid, otherwise undefined. Never throws. */
export async function validateApiKey(apiKey: string) {
  if (!baseUrl) return undefined;

  try {
    const response = await fetch(new URL("/api/validate", baseUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey }),
    });

    if (!response.ok) return undefined;

    const data = (await response.json()) as { valid: boolean; user_id?: string };
    return data.valid ? data.user_id : undefined;
  } catch {
    return undefined;
  }
}
