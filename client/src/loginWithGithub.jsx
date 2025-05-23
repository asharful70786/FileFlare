import { useNavigate } from 'react-router-dom';


const CLIENT_ID = 'Ov23lidAeIZjTPbfzaMj'; 

export default function LogWithGithub() {
   const navigate = useNavigate();
  const redirectToGitHub = () => {
    const githubAuthUrl = 'https://github.com/login/oauth/authorize';
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: 'http://localhost:4000/auth/github/callback',
      scope: 'read:user user:email',
      allow_signup: 'true',
    });

    window.location.href = `${githubAuthUrl}?${params.toString()}`;
     navigate("/");

  };

  return (
    <button onClick={redirectToGitHub} className="social-button">
      with GitHub
    </button>
  );
}
