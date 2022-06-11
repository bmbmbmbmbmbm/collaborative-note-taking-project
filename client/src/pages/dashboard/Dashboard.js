import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import Post from '../../components/Post';

export default function Dashboard(props) {
    const posts = [
        {   
            user: "eu001", 
            title: "Arm Processors", 
            tags: ["Arm Processors", "CPU", "RISK Processors"], 
            isEntry: true, 
            path: "/example-entry",
            id: 0
        },
        { 
            user: "eu002", 
            title: "How do I reference stuff?", 
            tags: ["Referencing", "Library"], 
            isEntry: false, 
            path: "/example-thread",
            id: 1
        }
    ];

    const units = [
        "Parallel Programming",
        "Safety Critical Systems",
        "Networks",
        "Logic and Semantics of Programming Languages",
        "Advanced Algorithms and Complexity",
        "Cryptography"
    ]

    const navigate = useNavigate();

    const redirect = (path) => {
        navigate(path);
        console.log(path);
    }
    
    useEffect(() => {
        if(props.isLoggedIn === false) {
            navigate("/site-access")
        }
    });

    return (
        <div className='dashboard' style={{paddingRight: "0.606%"}}>
            <Row>
                <Col style={{backgroundColor: '#DCDCDC', paddingLeft: "1%", minHeight: '100vh', height: '100vh'}}>
                    
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
                            <Button variant="secondary" size="lg" key={unit}>
                                {unit}
                            </Button>
                        )}
                    </div>
                </Col>
                <Col xs={6}>
                    <h1>My Entries and Threads</h1>
                    {posts.map(post => 
                        <Post 
                            key={post.id}
                            isEntry={post.isEntry}
                            User={post.user}
                            Unit={post.unit}
                            Title={post.title}
                            Content={post.contentPreview}
                            Tags={post.tags}
                            Path={post.path}
                            onClick={redirect}
                        />
                    )}
                </Col>
                <Col style={{backgroundColor: '#DCDCDC'}}>
                    <h1>Followed Entries</h1>
                    <h1>History</h1>
                </Col>
            </Row>
        </div>
    );

}