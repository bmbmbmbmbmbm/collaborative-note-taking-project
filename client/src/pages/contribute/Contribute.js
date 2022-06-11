import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import QNA from '../../components/QNA.js';

export default function SelectEntryType(props) {
    const [choice, setChoice] = useState(0);

    const navigate = useNavigate();
    useEffect(() => {
        if(props.isLoggedIn===false){
            navigate("/site-access");
        }
        if(choice===1) {
            navigate("/entry-creator");
        }
        else if(choice===2) {
            navigate("/thread-creator");
        }
        
    })

    return ( 
        <div className="SelectEntryType" style={{paddingTop: "2%", textAlign: "center", paddingLeft: "0.606%", paddingRight: "0.606%"}}>
            <Row>
                <h1 style={{paddingBottom: "2%"}}>What do you want to do?</h1>
                <Col style={{borderRight: "1px solid black"}}>
                    <img
                        alt=""
                        src="https://i.imgur.com/vHzpNC4.png"
                        style={{objectFit: "scale-down", width: "100%"}}
                    />
                </Col>
                <Col>
                    <img
                        alt=""
                        src="https://i.imgur.com/tWz5DzN.png"
                        style={{objectFit: "scale-down", width: "100%"}}
                    />
                </Col>
            </Row>
            <Row>
                <Col style={{borderRight: "1px solid black"}}>
                    <h2>Create an entry</h2>
                    <p style={{paddingLeft: "3%", paddingRight: "3%"}}>
                        You can make and share your notes with others, or keep them private if you so choose. You have the option to change this later. 
                        So, you do you.
                    </p>
                    <Button onClick={() => setChoice(1)}>Get started</Button>
                </Col>
                <Col>
                    <h2>Create a thread</h2>
                    <p style={{paddingLeft: "3%", paddingRight: "3%"}}>
                        These are public for either users in your enrolled units, or can be seen by everyone if you want. Ask a question, start a discussion, or just have chat.
                    </p>
                    <Button onClick={() => setChoice(2)}>Get started</Button>
                </Col>                    
            </Row>
            <QNA Question="Reminder of Etiquete..." Answer="<ul><li>Be respectful of others</li><li>Stay on topic</li><li>Make sure you have evidence to back your claims</li></ul>" QLeft={true}/>
        </div>
     );
}