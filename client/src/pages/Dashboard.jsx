import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    DropdownButton,
    Dropdown,
    Form,
    Button,
    Tabs,
    Tab,
} from "react-bootstrap";
import Prompt from "../components/Prompt";
import Post from "../components/Post";
import UnitDisplay from "../components/UnitDisplay";

export default function Dashboard({ user }) {
    const [search, setSearch] = useState("");

    const [units, setUnits] = useState([]);
    const [entries, setEntries] = useState([]);
    const [threads, setThreads] = useState([]);
    const [pinnedEntries, setPinnedEntries] = useState([]);
    const [pinnedThreads, setPinnedThreads] = useState([]);

    const [chooseSort, setChooseSort] = useState(0);
    const sortBy = ["Recent", "Newest", "Oldest"];

    useEffect(() => {
        fetch(`/entry/dashboard/${user}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem('token')
            }
        })
            .then(
                response => response.json()
            ).then(
                data => setEntries(data)
            );

        fetch(`/threads/dashboard/${user}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem('token')
            }
        })
            .then(
                response => response.json()
            ).then(
                data => {
                    setThreads(data)
                }
            );

        fetch(`/subject/get-units/${user}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem('token')
            }
        })
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
                            <div className="entries">
                                <div className="newEntryPrompt" style={{ borderBottom: "1px solid lightgrey", paddingBottom: "2%", marginBottom: "1%", textAlign: "center" }}>
                                    <Prompt title="Want to make a new entry?" desc="" link="/entry-creator" img=""/>
                                </div>

                                {entries.map(entry =>
                                    <Post
                                        isEntry={true}
                                        id={entry.id}
                                        title={entry.title}
                                        user={user}
                                        created={entry.created}
                                        updated={entry.updated}
                                        unitTitle={entry.unit_title}
                                        code={entry.code}
                                        positive={entry.positive}
                                        negative={entry.negative}
                                    />
                                )}
                            </div>

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
                            <div className="threads">
                                <div className="newEntryPrompt" style={{ borderBottom: "1px solid lightgrey", paddingBottom: "2%", marginBottom: "1%", textAlign: "center" }}>
                                    <Prompt title="Want to make a new thread?" desc="" link="/thread-creator" img=""/>
                                </div>
                                {threads.map(thread =>
                                    <Post
                                        isEntry={false}
                                        id={thread.id}
                                        title={thread.title}
                                        user={user}
                                        created={thread.created}
                                        updated={thread.last_reply}
                                        unitTitle={thread.unit_title}
                                        code={thread.code}
                                        positive={thread.positive}
                                        negative={thread.negative}
                                    />
                                )}
                            </div>

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
                            <div className="units">
                                {units.map(unit =>
                                    <UnitDisplay unitCode={unit.code} title={unit.title} key={unit.code + unit.title}/>
                                )}
                                <div className="missingUnit" style={{ textAlign: "center" }}>
                                    <h4>Missing a unit?</h4>
                                    <Link to='/enrolment'>Head to enrolment</Link>
                                </div>
                            </div>

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
                                <p>Your pinned entries will appear here when you pin them</p>
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
                                <p>Your pinned threads will appear here when you pin them</p>
                            </div>
                        )}
                    </Container>

                </Tab>
            </Tabs>
        </div>
    );
}
