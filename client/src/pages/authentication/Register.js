import React, { useState } from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

export default function Register () {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    function validateForm() {
        
        if(email.length > 0 && password === confirm) {
            const domainName = email.substring(email.indexOf('@'));
            console.log(domainName);
            return domainName === "@bath.ac.uk" && password.length > 0;
        }
        return email.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
    }


    return (
        <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail" onSubmit={handleSubmit}>
                <Form.Label>Email address</Form.Label>
                <FloatingLabel controlId="floatingInput" label="Enter your university email">
                    <Form.Control autoFocus type="email" placeholder="Enter university email" onChange={(e) => setEmail(e.target.value)}/>
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controldId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <FloatingLabel controlId="floatingInput" label="Enter a password">
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                </FloatingLabel>
                
            </Form.Group>
            <Form.Group className="mb-3" controldId="formBasicPassword">
                <Form.Label>Confirm password</Form.Label>
                <FloatingLabel controlId="floatingInput" label="Confirm that password">
                    <Form.Control type="password" placeholder="Confirm password" onChange={(e) => setConfirm(e.target.value)}/>
                </FloatingLabel>
                
            </Form.Group>
            <Button variant="primary" type="submit" disabled={!validateForm()}>
                Register
            </Button>
        </Form>
    );
}