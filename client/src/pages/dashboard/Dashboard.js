import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';

export default function Dashboard(props) {
    const units = [
        {name: 'Parallel Computing', id: 0},
        {name: 'Networking', id: 1},
        {name: 'Safety Critical Systems', id: 2},
        {name: 'Semantics of Programming Languages', id: 3},
        {name: 'Cryptography', id: 4},
        {name: 'Advanced Algorithms', id: 5}
    ];

    const navigate = useNavigate();
    
    useEffect(() => {
        if(props.isLoggedIn === false) {
            navigate("/site-access")
        }
    });

    return (
        <div className='dashboard'>
            <Row>
                <Col>
                    <h1>User Stuff</h1>
                </Col>
                <Col xs={6}>
                    <h1>Latest Entries and Threads</h1>
                </Col>
                <Col>
                    <h1>History</h1>
                    <h1>My Entries</h1>
                    <h1>Followed Entries</h1>
                </Col>
            </Row>
        </div>
    );

}