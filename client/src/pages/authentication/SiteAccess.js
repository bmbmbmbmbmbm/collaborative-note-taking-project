import React, { useState } from 'react';
import { Card, Nav } from 'react-bootstrap';
import Login from './Login.js';
import Register from './Register';

export default function SiteAccess(props) {
    const [isLoggingIn, setIsLoggingIn] = useState(true);

    function showRegister() {
        setIsLoggingIn(true);
    }

    function showLogin() {
        setIsLoggingIn(false);
    }
    
    return (
        <div style={{ padding: "11.1%" }}>
            <Card>
                <Card.Header>
                    <Nav variant="tabs" defaultActiveKey="#login">
                        <Nav.Item>
                            <Nav.Link href="#login" onClick={showRegister}>Login</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#register" onClick={showLogin}>Register</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Card.Header>
                <Card.Body>
                    {isLoggingIn && ( <Login onSuccess={props.onSuccess}/> )}
                    {!isLoggingIn && ( <Register onSuccess={props.onSuccess}/> )}
                </Card.Body>
                
            </Card>
            
        </div>
    );
    
}