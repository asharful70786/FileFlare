import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();
const clientId = process.env.Google_ClientId;
const clientSecret = process.env.Google_ClientSecret;
const redirectUri = "http://localhost:5173";

const client = new OAuth2Client(process.env.Google_ClientId, process.env.Google_ClientSecret, "http://localhost:5173");

export const loginWithGoogle = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: clientId,
  });

  const userInfo = ticket.getPayload();
 
  return userInfo;
}