import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import Post from '../../components/Post';

export default function Dashboard(props) {
    const [units, setUnits] = useState([{}]);
    const [posts, setPosts] = useState([{}]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/entry/view-all', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: "bm639" })
        }).then(
            response => response.json()
        ).then(
            data => {
                setPosts(data);
                console.log(data);
            }
        )

        const username = "bm639";

        fetch('/subject/user/bm639').then(
            response => response.json()
        ).then(
            data => {
                setUnits(data);
                console.log(data);
            }
        )


    }, []);

    return (
        <div className='dashboard'>
            {(typeof posts[0].created === 'undefined') ?
                <Spinner animation="border" role="status" style={{ align: "center" }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                :
                <Row>
                    <Col style={{ backgroundColor: '#DCDCDC', paddingLeft: "1%", minHeight: '100vh', height: '100vh' }}>

                        <div className="d-grid gap-2">
                            <h1>Filter</h1>
                            <Button variant="primary" size="lg">
                                My Entries
                            </Button>
                            <Button variant="secondary" size="lg">
                                My Threads
                            </Button>
                            <h1>Current Units</h1>
                            {units.map(unit =>
                                <Button variant="secondary" size="lg" key={unit.code}>
                                    {unit.title}
                                </Button>
                            )}
                        </div>
                    </Col>
                    <Col xs={6}>
                        <h1>My Entries and Threads</h1>
                        {posts.map(post =>
                            <Post
                                key={post.id}
                                isEntry={true}
                                User={"Dave"}
                                Unit={post.unit_code}
                                Title={post.title}
                            />
                        )}
                    </Col>
                    <Col style={{ backgroundColor: '#DCDCDC' }}>
                        <h1>Followed Entries</h1>
                        <h1>History</h1>
                    </Col>
                </Row>
            }

        </div>
    );

}