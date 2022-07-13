import { Route, Routes, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

import useToken from "./components/useToken";

import Dashboard from "./pages/dashboard/Dashboard";
import EntryCatalogue from "./pages/entry-catalogue/EntryCatalogue";
import EntryCreator from "./pages/entry-creator/EntryCreator";
import ErrorPage from "./pages/error-page/ErrorPage";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import ThreadCreator from "./pages/thread-creator/ThreadCreator";
import Entry from "./pages/entry-display/Entry";
import Thread from "./pages/thread-display/Thread";
import Enrolment from "./pages/Enrolment/Enrolment";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import Unit from "./pages/unit/Unit";

export default function Routing() {
  const { token, clearToken, setToken } = useToken();

  const navigate = useNavigate();

  function logout() {
    sessionStorage.clear();
    clearToken();
    navigate('/')
  }

  if (!token) {
    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container className="navigation">
            <Navbar.Brand
              href="/"
              style={{ fontFamily: "Times New Roman, Times, serif" }}
            >
              <img
                alt=""
                src="/icon.ico"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              Grady
            </Navbar.Brand>

            <Nav className="me-auto">
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </>
    );
  } else {
    const userString = sessionStorage.getItem('username');
    const user = JSON.parse(userString);

    console.log(user);
    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container className="navigation">
            <Navbar.Brand
              href="/"
              style={{ fontFamily: "Times New Roman, Times, serif" }}
            >
              <img
                alt=""
                src="/icon.ico"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              Grady
            </Navbar.Brand>

            <Nav className="me-auto">
              <Nav.Link href="/dashboard">dashboard</Nav.Link>
              <Nav.Link href="/view-entries">entries</Nav.Link>
              <Nav.Link href={`/profile/${user.username}`}>profile</Nav.Link>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/default-entry" element={<Entry token={token} />} />
          <Route path="/default-thread" element={<Thread isRoot={true} token={token} />} />
          <Route path="/dashboard" element={<Dashboard user={user.username} />} />
          <Route path="/view-entries" element={<EntryCatalogue token={token} />} />
          <Route path="/thread-creator" element={<ThreadCreator token={token} />} />
          <Route path="/profile/:username" element={<Profile token={token} />} />
          <Route path="/entry-creator" element={<EntryCreator token={token} />} />
          <Route path="/enrolment" element={<Enrolment token={token} />} />
          <Route path="/:unitId" element={<Unit token={token} user={user.username} />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </>
    );
  }
}