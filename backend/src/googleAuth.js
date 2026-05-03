import { OAuth2Client } from 'google-auth-library';

export async function verifyGoogleCredential(idToken) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('missing_google_config');
  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: clientId,
  });
  return ticket.getPayload();
}
