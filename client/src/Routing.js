import { Route, Routes, useNavigate } from "react-router-dom";
import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

import useToken from "./components/useToken";

import Dashboard from "./pages/dashboard/Dashboard";
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
import Account from "./pages/account/Account";
import EntryEditor from "./pages/entry-creator/EntryEditor";

export default function Routing() {
  const { username, setUsername, clearSession } = useToken();

  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    clearSession();
    navigate('/')
  }

  if (!localStorage.getItem('token')) {
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
          <Route path="/login" element={<Login setUsername={setUsername} />} />
          <Route path="/register" element={<Register setUsername={setUsername} />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </>
    );
  } else {
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
              <Nav.Link href={`/profile/${username}`}>profile</Nav.Link>
              <Nav.Link href="/account">Account</Nav.Link>
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/dashboard" element={<Dashboard user={username} />} />
          <Route path="/thread-creator" element={<ThreadCreator user={username} />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/entry-creator" element={<EntryCreator user={username} />}>
            <Route path="/entry-creator/:entryId" element={<EntryCreator user={username} />} />
          </Route>
          <Route path="/account" element={<Account  />} />
          <Route path="/enrolment" element={<Enrolment  user={username} />} />
          <Route path="/:unitId" element={<Unit />} />
          <Route path="/:unitId/entry/:entryId" element={<Entry user={username}/>} />
          <Route path="/:unitId/thread/:threadId" element={<Thread  user={username}/>} />
          <Route path="/:unitId/entry/:entryId/edit" element={<EntryEditor user={username}/>}/>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </>
    );
  }
}