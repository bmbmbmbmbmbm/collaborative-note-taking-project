import { useState } from 'react';

export default function useToken() {
  function getToken() {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  }

  const [token, setToken] = useState(getToken());

  function saveToken(userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  }

  function clearToken() {
    sessionStorage.clear()
    setToken();
  }

  return {
    token,
    setToken: saveToken,
    clearToken: clearToken,
  }
}