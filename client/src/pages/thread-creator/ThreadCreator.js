import React, { useState, useEffect } from 'react';
import { Form, InputGroup, FloatingLabel, Button, Row, Col, Container } from 'react-bootstrap';

export default function ThreadCreator({ token, user }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [units, setUnits] = useState([]);
    const [chosen, setChosen] = useState(0);
    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        fetch(`/subject/get-units/${user}`)
            .then(
                response => response.json()
            ).then(
                data => setUnits(data)
            );
    }, [])

    function onChange(text) {
        setContent(text);
        setWordCount(text.split(" ").length);
    }

    function invalidated() {
        return title.length < 6 || title.length > 64 || chosen === 0 || content.split(" ").length > 1000;
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log(units, chosen - 1, units[chosen - 1]);
        if(!invalidated()) {
            let body = {
                username: user,
                title: title,
                unitCode: units[chosen - 1].code,
                content: {
                    "content" : content
                }
            }
            fetch('/threads/create', {
                method: 'POST',
                headers: {
                    "x-access-token": token,
                    "Content-Type": "application/json"
                },
                body: body
            })
        } else {
            alert(`${chosen === 0 ? "No unit chosen\n": ""}
                ${title.length < 6 ? "Title is less than 6 characters\n" : (title.length > 64 ? "Title longer than 64 characters" : "")}
                ${content.split(" ").length > 1000 ? "Over 1000 words" : ""}`);
        }
    }

    return (
        <>
            <div style={{ backgroundColor: "white", padding: "0.3%" }}>
                <Container>
                    <h4>Create Thread</h4>
                </Container>
            </div>
            <Container className='threadForm' style={{ paddingTop: '1%', paddingBottom: '1%' }}>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col xs={9}>
                            <Form.Group className="mb-3" controlId="title">
                                <Form.Label>Thread Title</Form.Label>
                                <FloatingLabel controlId="floatinginput" label="What's the thread about?">
                                    <Form.Control autoFocus type="text" placeholder="What's the thread about?" onChange={(e) => setTitle(e.target.value)} />
                                </FloatingLabel>
                                <Form.Label style={{"color": title.length > 64 ? "red" : "black"}}>Length({title.length}/64)</Form.Label>
                            </Form.Group>
                        </Col>
                        <Col xs={3}>
                            <Form.Group className="mb-3" controlId="unitSelect">
                                <Form.Label>Unit Selection</Form.Label>
                                <Form.Select onChange={(e) => setChosen(e.target.value)} required>
                                    <option value={0}>What unit are you writing about?</option>
                                    {units.map((unit, index) => (
                                        <option key={unit.code} value={index + 1}>
                                            {unit.title}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controldId="content">
                        <Form.Label>Content</Form.Label>
                        <InputGroup>
                            <Form.Control as="textarea" aria-label="With textarea" placeholder='Your thoughts?' onChange={e => onChange(e.target.value)} />
                        </InputGroup>
                        <Form.Label style={{"color": wordCount > 1000 ? "red" : "black" }}>
                            Words({wordCount}/1000)
                        </Form.Label>
                    </Form.Group>

                    <Button md="auto" disabled={invalidated()} type="submit">Submit Entry</Button>

                </Form>
            </Container>
        </>

    );
}