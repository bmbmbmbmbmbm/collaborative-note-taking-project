import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Card, InputGroup, FloatingLabel, Button, Row, Col } from 'react-bootstrap';
import Thread from '../thread-display/Thread.js';

export default function ThreadCreator(props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    
    const navigate = useNavigate();
    
    useEffect(() => {
        if(props.isLoggedIn === false) {
            navigate("/site-access")
        }
    });

    function addTags(input) {
        const unfiltered = input.split(",");
        let filtered = [];
        var letters = /^[0-9a-zA-Z]+$/;
        for(let i = 0; i < unfiltered.length; ++i){
            if(letters.test(unfiltered[i])) {
                filtered = [...filtered, unfiltered[i]];
            } 
        }
        setTags(filtered);
    }

    function valdiateTitle() {
        return title.length < 6 || title.length > 64;
    }

    function handleSubmit(event) {
        event.preventDefault();
    }

    return ( 
        <div className='createThread' style={{paddingTop: '1%', paddingBottom: '1%'}}>
            <Card>
                <Card.Body>
                    <Form>
                        
                        <Form.Group className="mb-3" controlId="title" onSubmit={handleSubmit}>
                            <Form.Label>Thread Title</Form.Label>
                            <FloatingLabel controlId="floatinginput" label="What's the thread about?">
                                <Form.Control autoFocus type="text" placeholder="What's the thread about?" onChange={(e) => setTitle(e.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group className="mb-3" controldId="content">
                            <Form.Label>Content</Form.Label>
                                <InputGroup>
                                    <Form.Control as="textarea" aria-label="With textarea" placeholder='Your thoughts?' onChange={e => setContent(e.target.value)}/>
                                </InputGroup>
                        </Form.Group>

                        <Form.Label>
                            <h4>Tags</h4>
                            <h6>Seperate tags with a comma (,)</h6>
                        </Form.Label>
                        <Form.Group controlId='posttags' style={{marginBottom: "1%"}}>
                            <FloatingLabel controlId="floatinginput" label="What does this entry talk about?">
                                <Form.Control autoFocus type="text" placeholder="What does this entry talk about?" onChange={(e) => addTags(e.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>

                        <Row style={{marginBottom: "1%"}}>
                            <Col md="auto">
                                <Button md="auto" disabled={valdiateTitle()}>Submit Entry</Button>
                            </Col>
                            <Col md="auto">
                                <Button variant='outline-secondary' md="auto" onClick={() => setShowPreview(!showPreview)}>Preview</Button>
                            </Col>
                        </Row>

                    </Form>
                    {showPreview && <Thread isRoot={true} user="me" title={title} content={content} tags={tags}/>}
                </Card.Body>
            </Card>
        </div>
    );
}