import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

function Reply({ Id, commentId, token, depth, isThread }) {
    const [reply, setReply] = useState("");
    const myDepth = depth;

    function invalidated() {
        return !(reply.split(" ").length < 1000 && reply.length > 1);
    }

    function addReply(event) {
        event.preventDefault();
        let body;
        if(isThread) {
            if (commentId === undefined) {
                body = {
                    "content": reply,
                    "threadId": Id,
                }
            } else {
                body = {
                    "content": reply,
                    "threadId": Id,
                    "commentId": commentId,
                }
            }
            console.log(body);
            fetch('/threads/add-reply', {
                method: "POST",
                headers: {
                    "x-access-token": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
            })
        } else {
            if (commentId === undefined) {
                body = {
                    "content": reply,
                    "entryId": Id,
                }
            } else {
                body = {
                    "content": reply,
                    "entryId": Id,
                    "commentId": commentId,
                }
            }

            fetch('/entry/add-reply', {
                method: "POST",
                headers: {
                    "x-access-token": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
            })
        }
        

        
    }

    return (
        <div className="addReply" style={{ paddingTop: '1%' }}>
            <Card bg={myDepth % 2 === 0 ? "" : "light"}>
                <Card.Body>
                    <Form onSubmit={addReply}>
                        <Form.Label>
                            Add Comment
                        </Form.Label>
                        <Form.Control as="textarea" rows={5} onChange={(e) => setReply(e.target.value)} />
                        <Form.Text>
                            Ensure your comment follows site etiquete
                        </Form.Text>
                        <div className="submission" style={{ paddingTop: "1%" }}>
                            <Button type="submit" disabled={invalidated()}>
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