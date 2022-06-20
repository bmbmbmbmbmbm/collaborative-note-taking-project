import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Footer from './components/Footer';

import SiteAccess from './pages/authentication/SiteAccess'
import Contribute from './pages/contribute/Contribute'
import Dashboard from './pages/dashboard/Dashboard'
import EntryCatalogue from './pages/entry-catalogue/EntryCatalogue'
import EntryCreator from './pages/entry-creator/EntryCreator'
import ErrorPage from './pages/error-page/ErrorPage'
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile'
import ThreadCreator from './pages/thread-creator/ThreadCreator'
import Entry from './pages/entry-display/Entry'
import Thread from './pages/thread-display/Thread'

function Routing() {
  return (
    <>
      <Router>

        <Navbar bg="dark" variant="dark" expand="lg">
          <Container className="navigation">

            <Navbar.Brand href="/" style={{fontFamily: 'Times New Roman, Times, serif'}}>
              <img alt="" src="/icon.ico" width="30" height="30" className="d-inline-block align-top"/>
              Grady
            </Navbar.Brand>

            <Nav className="me-auto">
              <Nav.Link href="/dashboard">dashboard</Nav.Link>
              <Nav.Link href="/view-entries">entries</Nav.Link>
              <Nav.Link href="/my-profile">profile</Nav.Link>
              <Nav.Link href="/contribute">contribute</Nav.Link>
              <Nav.Link href="/site-access">login</Nav.Link>
            </Nav>

          </Container>
        </Navbar>

          <Routes>
            <Route path='/default-entry' element={<Entry/>}/>
            <Route path='/default-thread' element={<Thread isRoot={true}/>}/>
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

        

      </Router>
      <Footer />
    </>
      
  );
}

export default Routing;
