import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import Reply from './Reply';

export default function Commment({ id, postId, isThread, content, user, created, replies, token, depth }) {
    const myDepth = depth;
    const [hide, setHide] = useState(false);
    const [hideAddReply, setHideAddReply] = useState(true);

    return (
        <Card bg={myDepth % 2 === 0 ? "" : "light"} style={{ marginBottom: "2%" }}>
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
                <div className='content' style={{ paddingBottom: "0.5%", marginBottom: "0.5%", borderBottom: "1px solid grey" }}>
                    <h6>{content}</h6>
                </div>
                <div className='commentSettings' style={{ marginBottom: "1%" }}>
                    <style type="text/css">
                        {`
                            .textButton {
                                color: blue;
                            }
                        `}
                    </style>
                    <label className="textButton" onClick={() => setHideAddReply(!hideAddReply)}>{hideAddReply ? "Add reply" : "Hide reply input"}</label>
                </div>
                <div className={hideAddReply ? "d-none" : ""} style={{ marginBottom: "2%" }}>
                    <Reply Id={postId} commentId={id} token={token} depth={depth + 1} isThread={isThread} />
                </div>

                <div className='replies'>
                    {replies.filter(function (reply) {
                        return reply.replyTo === id;
                    }).map(reply =>
                        <Commment
                            key={reply.id}
                            id={reply.id}
                            postId={postId}
                            content={reply.reply.content}
                            user={reply.username}
                            created={reply.created}
                            replies={replies}
                            depth={depth + 1}
                            isThread={isThread}
                        />
                    )}
                </div>
            </Card.Body>

        </Card>
    );
}
