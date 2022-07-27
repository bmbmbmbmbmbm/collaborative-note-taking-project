import { useState } from 'react';

export default function useToken() {
  function getToken() {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  }

  function getUser() {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    return user?.username;
  }

  const [token, setToken] = useState(getToken());
  const [username, setUsername] = useState(getUser());

  function saveToken(userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  }

  function saveUsername(user) {
    sessionStorage.setItem('user', JSON.stringify({username: user}));
    setUsername(user);
  }

  function clearSession() {
    sessionStorage.clear()
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