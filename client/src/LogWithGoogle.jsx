import { GoogleLogin } from '@react-oauth/google';

function LogWithGoogle() {
  const BASE_URL = "http://localhost:4000";

  return (
    <>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const response = await fetch(`${BASE_URL}/auth/google-login`, {
              method: "POST",
              body: JSON.stringify({ token: credentialResponse.credential }),
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              console.error("Failed to log in via Google");
            } else {
              const data = await response.json();
              console.log("Login success:", data);
              // Optional: Save token/cookie or redirect
            }
          } catch (error) {
            console.error("Error during Google login:", error);
          }
        }}
        useOneTap
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </>
  );
}

export default LogWithGoogle;
