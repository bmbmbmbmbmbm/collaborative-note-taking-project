import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FloatingLabel, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

export default function Login () {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(result){ 
            navigate('/dashboard');
        }
    }, []);

    function validateForm() {
        
        if(email.length > 0) {
            const domainName = email.substring(email.indexOf('@'));
            console.log(domainName);
            return domainName === "@bath.ac.uk" && password.length > 6;
        }
        return email.length > 0 && password.length > 6;
    }

    function handleSubmit(event) {
        event.preventDefault();
        fetch("localhost:5000/login").then(
            res => res.json()
        ).then(
            data => setResult(data.result)
        )
    }


    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <FloatingLabel controlId="floatingInput" label="Enter your university email address">
                    <Form.Control autoFocus type="email" placeholder="Enter university email" onChange={(e) => setEmail(e.target.value)}/>
                </FloatingLabel>
                
            </Form.Group>
            <Form.Group className="mb-3" controldId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <FloatingLabel controlId="floatingInput" label="Enter your password">
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                </FloatingLabel>
                
            </Form.Group>
            <Row>
                <Col md="auto">
                    <Button variant="primary" type="submit" disabled={!validateForm()}>
                        Login
                    </Button>
                </Col>
                <Col md="auto">
                    <Button variant="outline-secondary">
                        Forgotton your email or password?
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}