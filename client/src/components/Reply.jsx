import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import v from './validation';
import { addReplyToEntry } from '../service/entry';
import { addReplyToThread } from '../service/thread';
function Reply({ Id, commentId, depth, isThread }) {
    const [reply, setReply] = useState("");
    const myDepth = depth;

    function validated() {
        return v.validContent(reply);
    }

    async function addReply(event) {
        event.preventDefault();
        if(isThread) {
            await addReplyToThread({ content: reply, threadId: Id, commentId: commentId }) 
        } else {
            await addReplyToEntry({ content: reply, entryId: Id, commentId: commentId })
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