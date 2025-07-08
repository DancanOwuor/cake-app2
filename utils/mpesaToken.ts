// utils/mpesaToken.ts

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getMpesaToken(): Promise<string> {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log("🔁 Reusing cached token");
    return cachedToken;
  }

  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error("Missing MPESA credentials");
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const response = await fetch(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errorMessage || "Failed to fetch access token");
  }

  // Cache it
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + 3500 * 1000; // 3500 seconds ~ 58 min

  console.log("✅ Fetched new token");
  return cachedToken!;
}
