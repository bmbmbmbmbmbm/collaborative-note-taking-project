import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import Reply from './Reply';

function Commment({ id, threadId, content, user, created, replies, token, depth }) {
    const myDepth = depth;
    const [hide, setHide] = useState(false);

    return (
        <Card bg={myDepth % 2 == 0 ? "" : "light"} style={{ marginBottom: "2%" }}>
            <Card.Header>
                <Row>
                    <Col>
                    <style type="text/css">
                        {`
                            .showButton {
                                color: #0066ff;
                            }
                            .showButton:hover {
                                text-decoration: underline;
                            }
                        `}
                    </style>
                        <label className='showButton' onClick={() => setHide(!hide)}>{hide ? "[+]" : "[-]"}</label> comment by <Link to={`/profile/${user}`}>{user}</Link>
                    </Col>
                    <Col>
                        <label style={{ float: "right" }}>{created}</label>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body className={hide ? 'd-none' : ''}>
                <div className='content'>
                    <h6>{content}</h6>

                </div>
                <div className="commentResponse" style={{ marginBottom: "2%" }}>
                    <Reply threadId={threadId} commentId={id} token={token} depth={depth + 1}/>
                </div>

                <div className='replies'>
                    {replies.filter(function (reply) {
                        return reply.replyTo === id;
                    }).map(reply =>
                        <Commment key={reply.id} id={reply.id} threadId={threadId} content={reply.reply.content} user={reply.username} created={reply.created} replies={replies} depth={depth + 1} />
                    )}
                </div>
            </Card.Body>

        </Card>
    );
}

export default Commment;