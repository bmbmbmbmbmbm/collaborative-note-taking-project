import React from 'react';
import { Carousel, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
                        style={{ width: "100%", maxHeight: "50vh", objectFit: "cover" }}
                        onClick={sendToRegister}
                    />
                    <Carousel.Caption>
                        <img alt="" src="../icon.ico" width="50" height="50" className="d-inline-block align-top" />
                        <h1>Welcome to Grady</h1>
                        <p>A place for students to create and share their notes</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1543196614-e046c7d3d82e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1641&q=80"
                        alt="Notes"
                        style={{ width: "100%", maxHeight: "50vh", objectFit: "cover" }}
                        onClick={sendToRegister}
                    />
                    <Carousel.Caption>
                        <img alt="" src="../icon.ico" width="50" height="50" className="d-inline-block align-top" />
                        <h1>Improve your grades</h1>
                        <p>Share your notes and get feedback from fellow students</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                        alt="Notes"
                        style={{ width: "100%", maxHeight: "50vh", objectFit: "cover" }}
                        onClick={sendToRegister}
                    />
                    <Carousel.Caption>
                        <img alt="" src="../icon.ico" width="50" height="50" className="d-inline-block align-top" />
                        <h1>Talk to other students</h1>
                        <p>Discuss your course</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            <div className="heading" style={{ backgroundColor: "white", borderBottom: "1px solid lightgrey" }}>
                <Container>
                    <h1>What is Grady?</h1>
                </Container>
            </div>
            <Container>
                <Row>
                    <Col>
                        <p className="homePara">A free platform for University of Bath students, Grady allows students to create and share their notes with their peers whilst trying to encourage students to adapt to an academic writing style. Grady looks to allow students to improve their knowledge by sharing it with their peers whilst they provide constructive feedback. This website also looks to facilitate discussion amongst students around their course and units, whether that means discussing their time at university or just general chit chat.</p>
                    </Col>
                    <Col>
                        <img
                            alt=""
                            src="https://i.imgur.com/vHzpNC4.png"
                            style={{ width: "100%", maxHeight: "50vh", objectFit: "cover", border: "solid 1px lightgrey", boxShadow: "10px 10px #eb3489" }}
                        />
                    </Col>
                </Row>
            </Container>
            <div className="heading">
                <Container style={{ borderBottom: "1px solid lightgrey" }}>
                    <h1>How does it work?</h1>
                </Container>
            </div>
            <Container>
                <Row>
                    <Col>
                        <img
                            alt=""
                            src="https://i.imgur.com/tWz5DzN.png"
                            style={{ width: "100%", maxHeight: "50vh", objectFit: "cover", border: "solid 1px lightgrey", boxShadow: "10px 10px #eb3489" }}
                        />
                    </Col>
                    <Col>
                        <p className="homePara">Grady works much like an encyclopaedia run by students, where students contribute their notes and others read and talk about them. The idea is for students to try and take a confident step forward and share what they know. This can be good for a number of reasons, other users may help you brush up on your knowledge, equally you may learn something from others that you didn’t know previously about subject. Additionally, you can also start discussion threads which allow you to dive into topics concerning your course or unit. </p>
                    </Col>

                </Row>
            </Container>
            <div className="heading">
                <Container style={{ borderBottom: "1px solid lightgrey" }}>
                    <h1>How do I sign up?</h1>
                </Container>
            </div>
            <Container>
                <Row>
                    <Col>
                        <p>
                            Either scroll back up to the top of the page and click register, or click one of the sign up buttons that matches your mood on the right.
                        </p>
                    </Col>
                    <Col className="d-grid gap-2">
                        <style type="text/css">
                            {`
                                .btn-fire {
                                    background-image: url('https://thumbs.gfycat.com/AdorableDapperGallowaycow-size_restricted.gif');
                                    font-family: old english text mt;
                                    color: grey;
                                }
                                .btn-fire:hover {
                                    color: white;
                                }

                                .btn-hyperpop {
                                    background-image: url('https://i.gifer.com/origin/9b/9bbfebddcab900ee6c731cd9c3f4d72b_w200.gif');
                                    font-family: impact;
                                    color: black;
                                }
                                .btn-fire:hyperpop {
                                    color: white;
                                }

                            `}
                        </style>
                        <Button onClick={sendToRegister} size="lg" variant="fire">
                            <h1>Sign Up</h1>
                        </Button>
                        <Button onClick={sendToRegister} size="lg" variant="hyperpop">
                            <h1>SIGN UP</h1>
                        </Button>
                        <Button onClick={sendToRegister} size="lg">
                            <h1>Sign Up</h1>
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}