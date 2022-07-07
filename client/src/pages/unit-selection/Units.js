import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Container, Form, FormControl, FloatingLabel } from "react-bootstrap";

export default function Units() {
    const [units, setUnits] = useState([{}]);
    const [enrolled, setEnrolled] = useState([{}])
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch(`/subject/Computer_Science`)
            .then((response) => response.json())
            .then((value) => {
                setUnits(value);
            });

        const username = "bm639"

        fetch(`/subject/user/${username}`).then(
            response => response.json()
        ).then(
            value => {
                setEnrolled(value);
            }
        )  
    }, []);

    function isEnrolled(unit) {
        var i = 0;
        console.log(enrolled);
        while(i < enrolled.length && unit.unit_code !== enrolled[i].unit_code) {
            ++i;
        }
        return unit.unit_code === enrolled[i].unit_code;
    }

    function removeEnrolled(unit) {
        var enroll = enrolled;
        var i = 0;
        while(i < enroll.length && enroll[i].unit_code !== unit.unit_code) ++i;
        if(enroll[i].unit_code === unit.unit_code) {
            enroll.splice(i, 1);
            setEnrolled(enroll);
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

    

    return (
        <div className="units">
            {typeof units[0].title === "undefined" ? (
                <Spinner animation="border" role="status" style={{ align: "center" }}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <Container>
                    <Card>
                        <Card.Body>
                            <h1>
                                Unit enrollment
                            </h1>
                            <Card.Text>
                                Choose units to enroll into. Obviously, the units you are taking are probably the best choice but feel free to explore units available on your course.
                                By default, all units below are those available on your course. If you need to enroll in a unit ordinarily not on your course, please contact an admin.
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    <Form style={{ marginTop: "0.5%" }}>
                        <Form.Group>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Search for a unit"
                            >
                                <FormControl
                                    type="search"
                                    placeholder="Search for a unit"
                                    className="me-2"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </FloatingLabel>
                        </Form.Group>
                        <Button style={{ marginTop: "0.5%" }}>
                            Enroll units
                        </Button>
                    </Form>

                    {checkSearch(units).map((unit) => (
                        <Card
                            key={unit.code}
                            style={{ marginTop: "0.5%" }}
                        >
                            <Card.Body>
                                <Card.Title>
                                    {unit.code}: {unit.title}
                                </Card.Title>
                                <Form.Check
                                    checked={() => isEnrolled(unit)}
                                    onChange={() => removeEnrolled(unit)}
                                    type="switch"
                                    id={unit.code}
                                />
                            </Card.Body>
                        </Card>
                    ))}
                </Container>
            )}
        </div>
    );
}
