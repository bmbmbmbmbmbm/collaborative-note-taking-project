import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap'

export default function Account({ token, user }) {
    const [email, setEmail] = useState("");
    const [dPass, setDPass] = useState("");
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [result, setResult] = useState("");

    function validatePasswords() {
        const conditions = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$/;
        if (newPass === confirmPass && conditions.test(newPass)) {
            return true;
        }
        return false;
    }

    async function checkPass(event) {
        event.preventDefault()
        if(validatePasswords()) {
            let body = {
                email: `${user}@bath.ac.uk`,
                oldPassword: oldPass,
                newPassword: newPass,
                confirmPassword: confirmPass
            }

            fetch('', {
                method: "PUT",
                headers: {
                    "authorization": token,
                    "Content-Type": "application/json"
                },
                body: body
            }).then(
                response => response.json()
            ).then(
                data => setResult(data.message)
            )
        }
    }

    return (
        <>
            <div className='accountHeader' style={{ backgroundColor: "white" }}>
                <Container>
                    <h3>Account</h3>
                </Container>
            </div>
            <div className='accountBody'>
                <Container>
                    <div className='changePassword' style={{marginBottom: "1%"}}>
                        <div className='passTitle' style={{ borderBottom: "1px solid grey" }}>
                            <h4>Change Password</h4>
                        </div>
                        <Form onSubmit={checkPass}>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control controlId="current" type="password" onChange={(e) => setOldPass(e.target.value)}/>
                            </Form.Group>
                            <Form.Group style={{marginBottom: "1%"}}>
                                <Form.Label>New Password</Form.Label>
                                <Form.Control controlId="new" type="password" onChange={(e) => setNewPass(e.target.value)}/>
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control controlId="confirm" type="password" onChange={(e) => setConfirmPass(e.target.value)}/>
                            </Form.Group>
                            <Button type="submit">Confirm</Button>
                        </Form>
                    </div>
                    <div className='deleteAccount'>
                        <div className='delTitle' style={{ borderBottom: "1px solid grey" }}>
                            <h4>Delete Account</h4>
                        </div>
                        <Form>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control controlId="email" type="email" onChange={(e) => setEmail(e.target.value)}/>
                            </Form.Group>
                            <Form.Group style={{marginBottom: "1%"}}>
                                <Form.Label>Password</Form.Label>
                                <Form.Control controlId="new" type="password" onChange={(e) => setDPass(e.target.value)}/>
                            </Form.Group>
                            {(email.length > 0 && dPass.length > 0) && 
                                <Alert variant="danger">
                                    Once you have deleted your account you cannot restore your account. You must register again with the same email.
                                </Alert>
                            }
                            <Button type="submit">Confirm</Button>
                        </Form>
                    </div>
                </Container>
            </div>
        </>
    );
}