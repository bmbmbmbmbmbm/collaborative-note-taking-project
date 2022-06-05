import React from "react";
import {Row, Col, Card } from "react-bootstrap";
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

export default function QNA(props) {
    function handleHTML(parseMe) {
        const santized = DOMPurify.sanitize(parseMe);
        return (parse(santized));
    }


    return ( 
        <div className="QnA">
            {props.QLeft && 
                <Row>
                    <Col style={{textAlign: "center", marginTop: "6%"}}>
                        <h2>
                            {props.Question}
                        </h2>
                    </Col>
                    <Col style={{textAlign: "justify", marginTop: "4.5%", borderLeft: "1px solid lightGrey"}}>
                        <Card bg="info" text="white">
                            <Card.Body>
                                {handleHTML(props.Answer)}
                            </Card.Body>
                        </Card>
                        
                    </Col>
                </Row>
            }
            {!props.QLeft && 
                <Row>
                    <Col style={{textAlign: "justify", marginTop: "4.5%", borderRight: "1px solid lightGrey"}}>
                        <Card bg="info" text="white">
                            <Card.Body>
                                {handleHTML(props.Answer)}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col style={{marginTop: "6%", textAlign: "center"}}>
                        <h2>
                            {props.Question}
                        </h2>
                    </Col>
                </Row>
            }
        </div> 
    );
}