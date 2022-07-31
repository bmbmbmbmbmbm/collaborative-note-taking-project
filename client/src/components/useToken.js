import { useState } from 'react';

export default function useToken() {
  function getToken() {
    const tokenString = localStorage.getItem('token');
    return tokenString
  }

  function getUser() {
    const userString = localStorage.getItem('user');
    return userString;
  }

  const [token, setToken] = useState(getToken());
  const [username, setUsername] = useState(getUser());

  function saveToken(userToken) {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  }

  function saveUsername(user) {
    localStorage.setItem('user', user);
    setUsername(user);
  }

  function clearSession() {
    localStorage.clear()
    setToken();
  }

  return {
    token,
    setToken: saveToken,
    username,
    setUsername: saveUsername,
    clearSession: clearSession,
  }
}