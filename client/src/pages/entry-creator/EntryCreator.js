import React, { useState } from 'react';
import { Form, FloatingLabel, Button, Container } from 'react-bootstrap';

import RichTextEditor from '../../components/rich-text-editor/RichTextEditor';

export default function CreateEntry() {
    const [title, setTitle] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        const content = JSON.parse(localStorage.getItem('content'));
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/entry-creator/user-entry", false);
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(content));
    }

    return (
        <Container style={{backgroundColor: "white", minHeight: '100vh'}}>
            <Form onSubmit={handleSubmit}>
                <FloatingLabel controlId="floatinginput" label="Entry Title" style={{paddingBottom: "1.5%"}}>
                    <Form.Control autoFocus type="text" placeholder="What's the thread about?" onChange={(e) => setTitle(e.target.value)}/>
                </FloatingLabel>
                <div className='richTextEditor' style={{borderBottom: "1px solid lightgray", marginBottom: "1%"}}>
                    <RichTextEditor />
                </div>
                
                <Button type="submit">Save</Button>
            </Form>
        </Container>
    )
}