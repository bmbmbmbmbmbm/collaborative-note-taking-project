import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Post from '../../components/Post';


export default function Unit({ token }) {
    const [threads, setThreads] = useState();
    const [entries, setEntries] = useState();

    const params = useParams();

    useEffect(() => {
        fetch(`/threads/${params.unitId}/view`)
            .then(
                response => response.json()
            ).then(
                data => setThreads(data)
            );

        fetch(`/entry/${params.unitId}/view`)
            .then(
                response => response.json()
            ).then(
                data => setEntries(data)
            )
    }, [])

    function getAll() {
        let posts = entries.concat(threads)
        return posts;
    }



    return (
        <div className={`unit-${params.unitId}`} onClick={getAll}>
            <div className="unitHeader" style={{ backgroundColor: "white" }}>
                <Container>
                    <h3>{params.unitId}</h3>
                </Container>
            </div>
            <div className="posts">
                <Container>
                    <Row>
                        <Col xs={3} style={{ borderRight: "1px solid lightgrey" }}>
                            <h5>Filters</h5>
                        </Col>
                        <Col xs={9}>
                            <Post
                                isEntry={true}
                                id={0}
                                title="Welcome to Grady"
                                user="bm639"
                                created="11/07/22"
                                updated="11/07/22"
                                code={params.unitId}
                                positive={0}
                                negative={0}
                            />
                            <Post
                                isEntry={true}
                                id={0}
                                title="Welcome to Grady"
                                user="bm639"
                                created="11/07/22"
                                updated="11/07/22"
                                code={params.unitId}
                                positive={0}
                                negative={0}
                            />
                            <Post
                                isEntry={true}
                                id={0}
                                title="Welcome to Grady"
                                user="bm639"
                                created="11/07/22"
                                updated="11/07/22"
                                code={params.unitId}
                                positive={0}
                                negative={0}
                            />
                            {getAll().map(post =>
                                <Post
                                    isEntry={post.last_reply === undefined}
                                    id={post.id}
                                    title={post.title}
                                    user={post.username}
                                    created={post.created}
                                    updated={post.last_reply === undefined ? post.updated : post.last_reply}
                                    code={params.unitId}
                                    positive={post.positive}
                                    negative={post.negative}
                                />
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}