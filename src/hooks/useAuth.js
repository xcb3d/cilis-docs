import { useState, useEffect } from 'react';

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/liveblock/auth", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "room": "abcd-undefined",
            "type": "getToken"
          }),
        });

        if (!response.ok) {
          throw new Error('Lỗi đăng nhập');
        }

        const data = await response.json();
        setToken(data.token);
        console.log('data.token:', data.token);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Có lỗi xảy ra'));
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return { token, loading, error };
};

export default useAuth;
