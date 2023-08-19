import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import v from '../../components/validation';
import { threadUrls, entryUrls } from '../../service/routes';
import { addReplyToEntry } from '../../service/entry';
function Reply({ Id, commentId, depth, isThread }) {
    const [reply, setReply] = useState("");
    const myDepth = depth;

    const token = localStorage.getItem('token');

    function validated() {
        return v.validContent(reply);
    }

    async function addReply(event) {
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
            fetch(threadUrls.addReply, {
                method: "POST",
                headers: {
                    "authorization": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
            })
        } else {
            addReplyToEntry({ content: reply, entryId: Id, commentId: commentId })
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
                            <Button type="submit" disabled={!validated()}>
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