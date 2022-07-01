import React, { useEffect, useState } from 'react';
import { Form, FloatingLabel, Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

export default function Register () {

    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [subjects, setSubjects] = useState([{}]);

    useEffect(function() {
        fetch('http://localhost:5000/subject').then(
            response => response.json()
        ).then(
            data => setSubjects(data)
        );
    }, [])

    function validateForm() {
        
        if(email.length > 0 && password === confirm) {
            const domainName = email.substring(email.indexOf('@'));
            console.log(domainName);
            return domainName === "@bath.ac.uk" && password.length > 0;
        }
        return email.length > 0 && password.length > 0;
    }

    function match() {
        if(confirm.length === 0 || confirm === password) return true;
        return false;
    }

    async function handleSubmit(event) {
        const form = event.currentTarget;
        if(form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropogation();
        }

        setValidated(true);

        const token = { email: email, password: password }
        await fetch('http://localhost:5000/register/', 
            {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(token)
            });
    }

    function onClick() {
        console.log(subjects);
    }

    return (
        <div onClick={onClick}>
            {(subjects[0].type === 'undefined') ? 
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            : 
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail" >
                        <Form.Label>Email address</Form.Label>
                        <FloatingLabel controlId="floatingInput" label="Enter your university email">
                            <Form.Control required autoFocus type="email" placeholder="Enter university email" onChange={(e) => setEmail(e.target.value)}/>
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group className="mb-3" controldId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <FloatingLabel controlId="floatingInput" label="Enter a password">
                            <Form.Control required type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                        </FloatingLabel>
                        
                    </Form.Group>
                    <Form.Group className="mb-3" controldId="formBasicPassword">
                        <Form.Label>Confirm password</Form.Label>
                        <FloatingLabel controlId="floatingInput" label="Confirm that password">
                            <Form.Control required type="password" placeholder="Confirm password" onChange={(e) => setConfirm(e.target.value)}/>
                        </FloatingLabel>
                        
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={!validateForm()}>
                        Register
                    </Button>
                </Form>
            }
        </div>
    );
}