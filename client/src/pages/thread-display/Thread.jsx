import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Reply from '../../components/Reply';
import Comment from '../../components/Comment';
import { getThreadReplies, getThread } from '../../service/thread';
export default function Thread() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [created, setCreated] = useState("");
    const [lastReply, setLastReply] = useState("");
    const [unitCode, setUnitCode] = useState("");
    const [interactions, setInteractions] = useState({ comments: [], replies: [] });

    const params = useParams();

    useEffect(() => {
        async function getData() {
            const { title, thread, username, created, lastReply, unitCode } = await getThread(params.threadId)
            const replies = await getThreadReplies(params.threadId)

            setTitle(title);
            setContent(thread.content);
            setAuthor(username);
            setCreated(created);
            setLastReply(lastReply)
            setUnitCode(unitCode)
            setInteractions(replies)
        }
        getData();
    }, []);

    return (
        <>
            <div className="header" style={{ backgroundColor: "white" }}>
                <Container>
                    <h1>{title}</h1>
                    <Row>
                        <Col>
                            <h4>by <Link to={`/profile/${author}`}>{author}</Link></h4>
                        </Col>
                        <Col>
                            <h4 style={{ float: "right" }}>Submitted to <Link to={`/${unitCode}`}>{unitCode}</Link></h4>
                        </Col>
                    </Row>

                    <label>Created: {created} {lastReply.length > 0 ? `- Last Reply: ${lastReply}` : ""}</label>
                </Container>
            </div>
            <Container>
                <div className="content" style={{ borderBottom: "1px solid lightgrey", paddingBottom: "1%", marginBottom: "1%" }}>
                    <h5>
                        {content}
                    </h5>
                </div>
                <div className="options">
                    <label>report</label> <label>pin</label>
                </div>
                <div className="threadResponse" style={{ paddingBottom: "2%" }}>
                    <Reply Id={params.threadId} depth={1} isThread={true} />
                </div>

                {interactions.comments.map(comment =>
                    <Comment key={comment.id} id={comment.id} postId={params.threadId} content={comment.reply.content} user={comment.username} created={comment.created} replies={interactions.replies} depth={0} isThread={true} />
                )}
            </Container>

        </>
    )
}

