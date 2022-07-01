import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

function Reply(props) {
    const [reply, setReply] = useState("");

    function addReply(event) {
        event.preventDefault();
        let temp = {
            "comment": reply,
            "username": "eu004",
            "parentId": props.id.substring(0, props.id.indexOf(':'))
        }

        console.log(props.id.substring(0, props.id.indexOf(':')))

        fetch(`/threads/update/${props.id.substring(0, props.id.indexOf(':'))}`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: temp
        })
        
    }

    return ( 
        <div className="addReply" style={{paddingTop: '1%'}}>
            <Card>
                <Card.Body>
                    <Form onSubmit={addReply}>
                        <Form.Label>
                            Add Comment
                        </Form.Label>
                        <Form.Control as="textarea" rows={5} onChange={(e) => setReply(e.target.value)}/>
                        <Form.Text>
                            Ensure your comment follows site etiquete
                        </Form.Text>
                        <div className="submission" style={{paddingTop: "1%"}}>
                            <Button type="submit">
                                Reply
                            </Button>
                        </div>
                        
                    </Form>
                </Card.Body>
            </Card>
        </div>
     );
}

export default Reply;