/** Returns the owning user_id if the key is valid, otherwise undefined. Never throws. */
export async function validateApiKey(apiKey: string) {
  const { apiKeyManagerUrl } = useRuntimeConfig();

  if (!apiKeyManagerUrl) return undefined;

  try {
    const response = await fetch(new URL("/api/validate", apiKeyManagerUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey }),
    });

    if (!response.ok) return undefined;

    const data = (await response.json()) as {
      valid: boolean;
      user_id?: string;
    };
    return data.valid ? data.user_id : undefined;
  } catch {
    return undefined;
  }
}
