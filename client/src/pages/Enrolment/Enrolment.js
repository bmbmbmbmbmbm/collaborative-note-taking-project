import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Enrolment({token, user}) {
    const [units, setUnits] = useState([{}]);
    const [enrolled, setEnrolled] = useState([])
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/subject/${user}`)
            .then((response) => response.json())
            .then((value) => {
                setUnits(value);
            });

        fetch(`/subject/get-units/${user}`).then(
            response => response.json()
        ).then(
            value => {
                setEnrolled(value);
            }
        )
    }, []);

    function isEnrolled(unit) {
        for(var i = 0; i < enrolled.length; ++i) {
            if(unit.code === enrolled[i].code) return true;
        }
    }

    function handleEnrol(unit) {
        if(enrolled.length === 0) {
            setEnrolled([unit]);
        } else {
            var enrol = enrolled;
            var i = 0;
            while (i < enrol.length - 1 && enrol[i].code !== unit.code) ++i;

            if (enrol[i].code === unit.code) {
                enrol.splice(i, 1);
                setEnrolled(enrol);
            } else {
                setEnrolled([...enrol, unit]);
            }
        }  
    }

    function checkSearch(available) {
        let filtered = [];
        var j = 0;
        for (var i = 0; i < available.length; ++i) {
            if (available[i].code.toLowerCase().includes(search.toLowerCase()) || available[i].title.toLowerCase().includes(search.toLowerCase())) {
                filtered[j] = available[i];
                j++;
            }
        }
        return filtered;
    }

    function enrolUnits(event) {
        event.preventDefault();
        
        let body = {
            username: user,
            units: enrolled
        };

        fetch('/subject/enrol', {
            method: "POST",
            headers: {
                "authorization": token,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(body)
        }).then(
            response => {
                if(response.status === 200) {
                    navigate('/dashboard');
                } else {
                    alert(response.json());
                }
            }
        )
    }

    return (
        <div className="units">
            {typeof units[0].title === "undefined" ? (
                <Spinner animation="border" role="status" style={{ align: "center" }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <>
                    <div className='filter' style={{ backgroundColor: "white" }}>
                        <Container>
                            <Row>
                                <h1>
                                    Unit Enrolment
                                </h1>
                                <p>
                                    Choose units to enroll into. Obviously, the units you are taking are probably the best choice but feel free to explore units available on your course.
                                    By default, all units below are those available on your course. If you need to enroll in a unit ordinarily not on your course, please contact an admin.
                               
                                </p>
                            </Row>
                                <Form onSubmit={enrolUnits}>
                                    <Row>
                                    <Col xs={11}>
                                        <Form.Group>
                                            <Form.Control
                                                type="search"
                                                placeholder="Search for a unit"
                                                className="me-2"
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={1}>
                                        <Button style={{float: "right"}} type="submit">
                                            Enrol
                                        </Button>
                                    </Col>
                                    </Row>
                                </Form>

                        </Container>
                    </div>
                    <Container>

                        {checkSearch(units).map((unit) => (
                            <Card
                                key={unit.code}
                                style={{ marginBottom: "0.5%" }}
                            >
                                <Card.Body>
                                    <Card.Title>
                                        {unit.code}: {unit.title}
                                    </Card.Title>
                                    <Form.Check
                                        checked={isEnrolled(unit)}
                                        onChange={() => handleEnrol(unit)}
                                        type="switch"
                                        id={unit.code}
                                    />
                                </Card.Body>
                            </Card>
                        ))}
                    </Container>
                </>
            )}
        </div>
    );
}
