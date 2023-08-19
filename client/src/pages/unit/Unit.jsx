import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Dropdown, DropdownButton } from 'react-bootstrap';
import Post from '../../components/Post';
import { getUnitEntries } from '../../service/entry';
import { getUnitTitle } from '../../service/subject';

export default function Unit() {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");

    const [, setSearch] = useState("");
    
    const sortBy = ["Recent", "Old", "Top Voted"];

    const token = localStorage.getItem('token')

    const params = useParams();

    useEffect(() => {
        async function getData() {
            const unitEntries = await getUnitEntries(params.unitId)
            const unitThreads = await getUnitThreads(params.unitId)
            setPosts([...unitEntries, ...unitThreads])
            setTitle(await getUnitTitle(params.unitId))
        }
        getData()
    }, [])

    return (
        <div className={`unit-${params.unitId}`}>
            <div className="unitHeader" style={{ backgroundColor: "white" }}>
                <Container>
                    <Row>
                    <h3>{params.unitId}: {title}</h3>
                    </Row>
                    
                    <Form>
                        <Row>
                            <Col xs={1}>
                                <h4>Recent</h4>
                            </Col>
                            <Col xs={10}>
                                <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    className="me-2"
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ marginBottom: "1%" }}
                                />
                            </Col>
                            <Col xs={1}>
                                <DropdownButton title="Sort By">
                                    {sortBy.map(item => 
                                        <Dropdown.Item key={item}>{item}</Dropdown.Item>    
                                    )}
                                </DropdownButton>
                            </Col>
                           
                        </Row>
                    </Form>
                </Container>
            </div>
            <div className="posts">
                <Container>
                    {posts.map(post =>
                        <Post
                            key={post.username + post.id + post.title}
                            isEntry={post.last_reply === undefined}
                            id={post.id}
                            title={post.title}
                            user={post.username}
                            created={post.created}
                            updated={post.last_reply === undefined ? post.updated : post.last_reply}
                            code={params.unitId}
                            unitTitle={title}
                            positive={post.positive}
                            negative={post.negative}
                        />
                    )}
                </Container>
            </div>
        </div>
    );
}