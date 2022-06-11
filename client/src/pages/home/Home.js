import React from 'react';
import { Carousel, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import QNA from '../../components/QNA.js';

export default function Home() {
    const navigate = useNavigate()

    function sendToRegister() {
        navigate("/site-access");
    }

    return (
        <div className="home">
            <Carousel variant="light">
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1610210752279-e19c66c31e9b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                        alt="Notes"
                        style={{width: "100%", maxHeight: "50vh", objectFit: "cover"}}
                        onClick={sendToRegister}
                    />
                    <Carousel.Caption>
                        <img alt="" src="../icon.ico" width="50" height="50" className="d-inline-block align-top"/>
                        <h1>Welcome to Grady</h1>
                        <p>A place for students to create and share their notes</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1543196614-e046c7d3d82e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1641&q=80"
                        alt="Notes"
                        style={{width: "100%", maxHeight: "50vh", objectFit: "cover"}}
                        onClick={sendToRegister}
                    />
                    <Carousel.Caption>
                        <img alt="" src="../icon.ico" width="50" height="50" className="d-inline-block align-top"/>
                        <h1>Improve your grades</h1>
                        <p>Share your notes and get feedback from fellow students</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                        alt="Notes"
                        style={{width: "100%", maxHeight: "50vh", objectFit: "cover"}}
                        onClick={sendToRegister}
                    />
                    <Carousel.Caption>
                        <img alt="" src="../icon.ico" width="50" height="50" className="d-inline-block align-top"/>
                        <h1>Talk to other students</h1>
                        <p>Discuss your course</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            <Container style={{backgroundColor: "white", paddingTop: "2%", paddingBottom: "2%"}}>
                <div className="signUpPrompt" style={{textAlign: "center", paddingBottom: "4%"}}>
                    <h1>Want to sign up?</h1>
                    <Button size="lg" onClick={sendToRegister}>Click here</Button>
                </div>
                <Row>
                    <Col>
                        <img 
                            alt="" 
                            src="https://i.imgur.com/vHzpNC4.png"
                            style={{width: "100%", maxHeight: "50vh", objectFit: "cover"}}
                        />
                    </Col>
                    <Col>
                        <h1>What is Grady?</h1>
                        <p className="homePara">A free platform for University of Bath students, Grady allows users to create and share their notes with other students both in and out of their course. Sharing notes allows for everyones knowledge to be improved. Others may critique your notes to help you improve them, and likewise they gain knowledge from reading them. Additionally, Grady allows for general student discussion regarding their time at university.</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1>How does it work?</h1>
                        <p className="homePara">Users can create either notes or posts that other users can look at and discuss. Notes are where you have written about your subject, whether these are lecture notes, revision notes or something else entirely. Posts are more social, where students can talk about anything relating to their studies.</p>
                    </Col>
                    <Col>
                        <img 
                            alt="" 
                            src="https://i.imgur.com/tWz5DzN.png"
                            style={{width: "100%", maxHeight: "50vh", objectFit: "cover"}}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}