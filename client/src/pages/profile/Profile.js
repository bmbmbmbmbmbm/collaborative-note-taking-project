import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Post from '../../components/Post.js';

export default function Profile() {
    const params = useParams();
    const [subject, setSubject] = useState();
    const [publicEntries, setPublicEntries] = useState();
    const [threads, setThreads] = useState();
    const [units, setUnits] = useState()

    useEffect(() => {
        fetch(`/subject/get-subject/${params.username}`)
            .then(
                response => response.json()
            ).then(
                data => setSubject(data)
            );

        fetch(`/subject/get-units/${params.username}`)
            .then(
                response => response.json()
            ).then(
                data => setUnits(data)
            );

        fetch(`/entry/public/${params.username}`)
            .then(
                response => response.json()
            ).then(
                data => setPublicEntries(data)
            );

        fetch(`/threads/view-all/${params.username}`)
            .then(
                response => response.json()
            ).then(
                data => setThreads(data)
            )
    }, [])

    const navigate = useNavigate();



    return (
        <div className="Profile">
            <div className="user" style={{ backgroundColor: "white" }}>
                <Container>
                    {(subject === undefined) ?
                        <Spinner animation="border" role="status" style={{ align: "center" }}>
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                        :
                        <div>
                            <h1>{params.username}</h1>
                            <h4>{subject.title}</h4>
                        </div>
                    }
                </Container>
            </div>
            <div className="information">
                <Container>
                    <Row>
                        {(units === undefined) ?
                            <Spinner animation="border" role="status" style={{ align: "center" }}>
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            :
                            <div className="units">
                                <h3 style={{ borderBottom: "1px solid grey", marginBottom: "1%" }}>Units</h3>
                                <ul>
                                    {units.map(unit =>
                                        <li key={unit.code}><Link to={`/unit/${unit.code}`}>{unit.code} - {unit.title}</Link></li>
                                    )}
                                </ul>
                            </div>

                        }

                    </Row>
                    <Row>
                        <Col>

                            {(publicEntries === undefined) ?
                                <Spinner animation="border" role="status" style={{ align: "center" }}>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                                :
                                <div className='userEntries'>
                                    <h3 style={{ borderBottom: "1px solid grey", marginBottom: "1%" }}>Entries</h3>
                                    
                                </div>
                            }

                        </Col>
                        <Col>
                            {(threads === undefined) ?
                                <Spinner animation="border" role="status" style={{ align: "center" }}>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                                :
                                <div className='userThreads'>
                                    <h3 style={{ borderBottom: "1px solid grey", marginBottom: "1%" }}>Threads</h3>
                                </div>
                            }

                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );

}
