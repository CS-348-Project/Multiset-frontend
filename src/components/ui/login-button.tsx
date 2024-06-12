import React from 'react';
import GoogleButton from 'react-google-button';

const LoginButton: React.FC = () => {
  const onGoogleLoginSuccess = () => {
    const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
    const REDIRECT_URI = 'api/login/google/';

    const clientId = "351079269408-cjr2v77v05pb1f6pqj1f3cb8v93k0s4t.apps.googleusercontent.com";
    const backendApiUrl = "http://localhost:8000";

    if (!clientId || !backendApiUrl) {
      console.error('Environment variables for Google OAuth are missing');
      alert('Google OAuth configuration is missing. Please check your environment settings.');
      return;
    }

    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ');

    const params = {
      response_type: 'code',
      client_id: clientId,
      redirect_uri: `${backendApiUrl}/${REDIRECT_URI}`,
      prompt: 'select_account',
      access_type: 'offline',
      scope
    };

    const urlParams = new URLSearchParams(params).toString();
    window.location.href = `${GOOGLE_AUTH_URL}?${urlParams}`;
  };

  return <GoogleButton onClick={onGoogleLoginSuccess} label="Sign in with Google" />;
};

export default LoginButton;
