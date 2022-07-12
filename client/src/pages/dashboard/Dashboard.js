import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    DropdownButton,
    Dropdown,
    Form,
    FloatingLabel,
    Tabs,
    Tab,
} from "react-bootstrap";
import Prompt from "../../components/Prompt";

export default function Dashboard(props) {
    const [search, setSearch] = useState("");

    const [units, setUnits] = useState([]);
    const [entries, setEntries] = useState([]);
    const [threads, setThreads] = useState([]);
    const [pinnedEntries, setPinnedEntries] = useState([]);
    const [pinnedThreads, setPinnedThreads] = useState([]);

    const [chooseSort, setChooseSort] = useState(0);
    const sortBy = ["Recent", "Newest", "Oldest"];

    const user = "bm639";

    useEffect(() => {
        let status = 0;

        fetch(`/entry/view-all/${user}`)
            .then(
                response => response.json()
            ).then(
                data => setEntries(data)
            );

        fetch(`/threads/view-all/${user}`)
            .then(
                response => response.json()
            ).then(
                data => setThreads(data)
            );

        fetch(`/subject/units/user/${user}`)
            .then(
                response => response.json()
            ).then(
                data => setUnits(data)
            );
    }, []);

    return (
        <div className="dashboard">
            <div className="searchAndFilter" style={{ backgroundColor: "white" }}>
                <Container >
                    <Row>
                        <Col xs={1}>
                            <h4 style={{ marginTop: "auto", marginBottom: "auto" }}>
                                {sortBy[chooseSort]}
                            </h4>
                        </Col>
                        <Col xs={10}>
                            <Form>
                                <Form.Group>
                                    <Form.Control
                                        type="search"
                                        placeholder="Search"
                                        className="me-2"
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col xs={1}>
                            <DropdownButton title="Sort By" style={{ float: "right" }}>
                                {sortBy.map(option =>
                                    <Dropdown.Item key={option}>{option}</Dropdown.Item>
                                )}
                            </DropdownButton>
                        </Col>
                    </Row>
                </Container>
            </div>


            <Tabs defaultActiveKey="My Entries" className="mb-3" style={{ backgroundColor: "white", justifyContent: "center" }}>
                <Tab eventKey="My Entries" title="My Entries">
                    <Container>
                        {entries.length > 0 ? (
                            <div>Stuff</div>
                        ) : (
                            <Prompt
                                title="Create an entry"
                                img="https://i.imgur.com/vHzpNC4.png"
                                desc="You can make and share your notes with others, or keep them private if you so choose. You have the option to change this later. So, you do you."
                                link="/entry-creator"
                            />
                        )}
                    </Container>

                </Tab>
                <Tab eventKey="My Threads" title="My Threads">
                    <Container>
                        {threads.length > 0 ? (
                            <div>Stuff</div>
                        ) : (
                            <Prompt
                                title="Create a thread"
                                img="https://i.imgur.com/tWz5DzN.png"
                                desc="These are public for either users in your enrolled units, or can be seen by everyone if you want. Ask a question, start a discussion, or just have chat."
                                link="/thread-creator"
                            />
                        )}
                    </Container>

                </Tab>
                <Tab eventKey="My Units" title="My Units">
                    <Container>
                        {units.length > 0 ? (
                            <div>Stuff</div>
                        ) : (
                            <Prompt
                                title="Enrol in some units"
                                img="https://i.imgur.com/fEJuEh5.png"
                                desc="To interact with the other users, or make entries and threads you need to enrol in some units from your subject"
                                link="/enrolment"
                            />
                        )}
                    </Container>

                </Tab>
                <Tab eventKey="Pinned Entries" title="Pinned Entries">
                    <Container>
                        {pinnedEntries.length > 0 ? (
                            <div>Stuff</div>
                        ) : (
                            <div className="noPosts" style={{ textAlign: "center" }}>
                                <h4>There's nothing here...</h4>
                                <Link to="/entry-creator">Why not make an entry?</Link>
                                <Link to="/entry-creator">or a thread?</Link>
                            </div>
                        )}
                    </Container>

                </Tab>
                <Tab eventKey="Pinned Threads" title="Pinned Threads">
                    <Container>
                        {pinnedThreads.length > 0 ? (
                            <div>Stuff</div>
                        ) : (
                            <div className="noPosts" style={{ textAlign: "center" }}>
                                <h4>There's nothing here...</h4>
                                <Link to="/entry-creator">Why not make an entry?</Link>
                                <Link to="/entry-creator">or a thread?</Link>
                            </div>
                        )}
                    </Container>

                </Tab>
            </Tabs>
        </div>
    );
}
