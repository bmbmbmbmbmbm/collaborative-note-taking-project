import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import Post from '../../components/Post.js';

export default function Profile(props) {
    const navigate = useNavigate();
    
    useEffect(() => {
        if(props.isLoggedIn === false) {
            navigate("/site-access")
        }
    });
    
    return (
        <div>
            <Row style={{ paddingTop: '1%'}}>
                <h1>eu001's Profile Page</h1>
            </Row>
            <Row style={{ marginTop: '1%', marginBottom: '1%' }}>
                <Col>
                    <Card>
                        <Card.Header>
                            <h2>Subjects</h2>
                        </Card.Header>   
                        <Card.Body>
                            Their subjects.
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row style={{ marginTop: '1%', marginBottom: '1%' }}>
                <Col>
                    <Card>
                        <Card.Header>
                            <h2>Post Score</h2>
                        </Card.Header>
                        <Card.Body>
                            How well received their posts are.
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row style={{ marginTop: '1%', marginBottom: '1%' }}>
                <Col>
                    <Card>
                        <Card.Header>
                            <h2>Public Entries</h2>
                        </Card.Header>   
                        <Card.Body>
                            <Post isEntry={true} User="eu001" Title="Arm Processors" Content="Some content" Tags={["Arm Processors", "CPU", "RISK Processors"]}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Header>
                            <h2>Threads</h2>
                        </Card.Header>
                        <Card.Body>
                            <Post isEntry={false} User="eu002" Title="How do I reference stuff?" Content="Does anyone know how you're meant to reference papers?" Tags={["Referencing", "Library"]}/>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row style={{ marginTop: '1%', paddingBottom: '1%' }}>
                <Col>
                    <Card>
                        <Card.Header>
                            <h2>History</h2>
                        </Card.Header>   
                        <Card.Body>
                            <Post isEntry={false} User="eu002" Title="How do I reference stuff?" Content="Does anyone know how you're meant to reference papers?" Tags={["Referencing", "Library"]}/>
                            <Post isEntry={true} User="eu001" Title="Arm Processors" Content="Some content" Tags={["Arm Processors", "CPU", "RISK Processors"]}/>   
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
    
}
