import React, { useEffect, useState } from "react";
import { Form, FloatingLabel, Spinner, InputGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [subjects, setSubjects] = useState([{}]);
    const [chosenSubject, setChosen] = useState(0);

    const [validated, setValidated] = useState(false);

    useEffect(() => {
        fetch("/subject")
            .then((response) => response.json())
            .then((data) => {
                setSubjects(data);
            });
    }, []);

    function validatePasswords() {
        const conditions = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$/;
        if (password === confirm && conditions.test(password)) {
            return true;
        }
        return false;
    }

    function validateEmail() {
        // Don't know the max length of a username, but assumed it would not be greater than 8 characters in length based on my own.
        if (email.length > 11 && email.length < 19) {
            const domainName = email.substring(email.indexOf("@"));
            return domainName === "@bath.ac.uk";
        }
        return false;
    }

    function validateSubject() {
        return chosenSubject !== 0;
    }

    function validateForm() {
        // Are all their credentials valid?
        return validateEmail() && validatePasswords() && validateSubject();
    }

    async function handleSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        if(!validateForm()) {
            setValidated(false);
            return;
        }
  
        const token = { email: email, password: password, subject_id: chosenSubject }
        await fetch('/register/', 
            {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(token)
            });

        setValidated(true);
    }

    return (
        <>
            {/*  
            The statement below is querying if the subjects users can choose from has been loaded from the backend yet. If they haven't been, then they should have
            undefined types, in this case a spinner is displayed to show it's being loaded.
            */}
            {typeof subjects[0].title === "undefined" ? (
                <Spinner animation="border" role="status" style={{ align: "center" }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Enter your university email address"
                        >
                            <Form.Control
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </FloatingLabel>
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid email
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword1">
                        <Form.Label>Password</Form.Label>
                        <FloatingLabel controlId="floatingInput" label="Choose a password">
                            <Form.Control
                                type="password"
                                placeholder="password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </FloatingLabel>
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid password
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword2">
                        <Form.Label>Confirm password</Form.Label>
                        <FloatingLabel controlId="floatingInput" label="Confirm password">
                            <Form.Control
                                type="password"
                                placeholder="password"
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                            />
                        </FloatingLabel>
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid password
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formSubject">
                        <Form.Label>What subject do you take?</Form.Label>
                        <FloatingLabel controlId="floatingInput" label="Choose a subject">
                            <Form.Select onChange={(e) => setChosen(e.target.value)} required>
                                <option value={0}></option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.title}
                                    </option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid password
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" disabled={!validateForm()}>Register</Button>
                </Form>
            )}
        </>
    );
}
