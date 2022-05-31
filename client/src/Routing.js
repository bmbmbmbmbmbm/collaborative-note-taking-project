import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

import SiteAccess from './pages/authentication/SiteAccess'
import Contribute from './pages/contribute/Contribute'
import Dashboard from './pages/dashboard/Dashboard'
import EntryCatalogue from './pages/entry-catalogue/EntryCatalogue'
import EntryCreator from './pages/entry-creator/EntryCreator'
import ErrorPage from './pages/error-page/ErrorPage'
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile'
import ThreadCreator from './pages/thread-creator/ThreadCreator'

function Routing() {
  return (
    <>
      <Router>

        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>

            <Navbar.Brand href="/" style={{fontFamily: 'Times New Roman, Times, serif'}}>
              <img alt="" src="/icon.ico" width="30" height="30" className="d-inline-block align-top"/>
              Grady
            </Navbar.Brand>

            <Nav className="me-auto">
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <Nav.Link href="/view-entries">Entries</Nav.Link>
              <Nav.Link href="/my-profile">My Profile</Nav.Link>
              <Nav.Link href="/contribute">Contribute</Nav.Link>
              <Nav.Link href="/site-access">Login</Nav.Link>
            </Nav>

          </Container>
        </Navbar>

        <Container className="h-100" style={{backgroundColor: 'white', minHeight: `100vh`, height: `100vh`}}>
          <Routes>
            
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/view-entries" element={<EntryCatalogue/>}/>
            <Route path="/contribute" element={<Contribute/>}/>
            <Route path="/thread-creator" element={<ThreadCreator/>}/>
            <Route path="/my-profile" element={<Profile/>}/>
            <Route path="/entry-creator" element={<EntryCreator/>}/>

            <Route path='/' element={<Home/>}/>
            <Route path="/site-access" element={<SiteAccess/>}/>
            <Route path="*" element={<ErrorPage/>}/>
          </Routes>
        </Container>
        

      </Router>
    </>
      
  );
}

export default Routing;
