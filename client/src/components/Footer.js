import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

export default function Footer() {
    return ( 
        <footer className="p-3 bg-dark text-white">
            <Container>
                <Row>
                    <Col>
                        <h4 className='footerTitle'>Grady</h4>
                        <ul>
                            <li>
                                Questions
                            </li>
                            <li>
                                Help
                            </li>
                        </ul>
                    </Col>
                    <Col>
                        <h4 className='footerTitle'>Help</h4>
                        <ul>
                            <li>
                                Entries
                            </li>
                            <li>
                                Threads
                            </li>
                            <li>
                                Account
                            </li>
                        </ul>
                    </Col>
                    <Col>
                        <h4 className='footerTitle'>Feedback</h4>
                        <ul>
                            <li>
                                Feedback
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}