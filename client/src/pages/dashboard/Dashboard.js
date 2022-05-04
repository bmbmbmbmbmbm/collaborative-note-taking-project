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
        <div className='dashboard' >
            <Row style={{marginBottom: "1%"}}>
            <h1>Dashboard</h1>
            </Row>
            <Row style={{marginBottom: "1%"}}> 
                <Col>
                    <Card>
                        <Card.Header>
                            My Entries
                        </Card.Header>
                        <Card.Body>
                            Some entries
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Header>
                            Followed Entries
                        </Card.Header>
                        <Card.Body>
                            Some more entries
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row style={{marginBottom: "1%"}}>
                <Col>
                    <Card>
                        <Card.Header>
                            Enrolled Units
                        </Card.Header>
                        <Card.Body>
                            <Row xs="auto" md="auto" className="g-2">
                            {units.map( unit =>
                            <Col key={unit.id} md="2">
                                <Card style={{margin: 'auto'}} bg="info">
                                    <Card.Body>
                                        {unit.name}
                                    </Card.Body> 
                                </Card> 
                            </Col>
                                
                            )}
                            </Row>
                            
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );

}