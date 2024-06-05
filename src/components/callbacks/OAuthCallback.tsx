// src/components/OAuthCallback.jsx
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (code) {
          const response = await axios.post('http://127.0.0.1:8000/accounts/google/login/callback/', {
            code,
            provider: 'google',
          });

          const { access_token } = response.data;

          localStorage.setItem('token', access_token);

          navigate('/home');
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, [history, location]);

  return <div>Loading...</div>;
};

export default OAuthCallback;
