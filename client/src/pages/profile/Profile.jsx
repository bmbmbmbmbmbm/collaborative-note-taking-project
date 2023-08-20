import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { getUserEntries } from '../../service/entry';
import { getUserSubject, getUserUnits } from '../../service/subject';
import { getUserThreads } from '../../service/thread';

export default function Profile() {
    const params = useParams();
    const [subject, setSubject] = useState();
    const [publicEntries, setPublicEntries] = useState();
    const [threads, setThreads] = useState();
    const [units, setUnits] = useState()

    useEffect(() => {
        async function getData() {
            setPublicEntries(await getUserEntries(params.username))
            setSubject(await getUserSubject(params.username))
            setUnits(await getUserUnits(params.username))
            setThreads(await getUserThreads(params.username))
        }
        getData();
    }, [])

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
