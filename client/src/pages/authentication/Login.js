import React, { useState } from 'react';
import { Form, FloatingLabel, Row, Col, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

export default function Login({ setToken }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    function validateForm() {
        if (email.length > 0) {
            const domainName = email.substring(email.indexOf('@'));
            return domainName === "@bath.ac.uk" && password.length > 6;
        }
        return email.length > 0 && password.length > 6;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        let token = {
            email: email,
            password: password
        };

        await fetch("/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(token)
        }).then(
            response => response.json()
        ).then(
            data => setToken(data)
        )
        navigate('/dashboard');
    }


    return (
        <div>
            <div style={{ backgroundColor: "white" }}>
                <Container>
                    <h3>Login</h3>
                </Container>
            </div>
            <Container>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <FloatingLabel label="Enter your university email address">
                            <Form.Control autoFocus type="email" placeholder="Enter university email" onChange={(e) => setEmail(e.target.value)} />
                        </FloatingLabel>

                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <FloatingLabel label="Enter your password">
                            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        </FloatingLabel>

                    </Form.Group>
                    <Row>
                        <Col md="auto">
                            <Button variant="primary" type="submit" disabled={!validateForm()}>
                                Login
                            </Button>
                        </Col>
                        <Col md="auto">
                            <Button variant="outline-secondary">Forgotten password</Button>
                        </Col>
                    </Row>
                </Form>
                <label style={{marginTop: "0.5%"}}>Not got an account? Register <Link to="/register">here</Link>.</label>
            </Container>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
  };