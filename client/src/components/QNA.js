import React from "react";
import {Row, Col} from "react-bootstrap";
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
                    <Col style={{textAlign: "justify", marginTop: "4.5%", borderLeft: "1px solid black"}}>
                        <p style={{height: "100%", paddingLeft: "2%", paddingRight: "2%", background: "LightGrey"}}>
                            {handleHTML(props.Answer)}
                        </p>
                    </Col>
                </Row>
            }
            {!props.QLeft && 
                <Row>
                    <Col style={{textAlign: "justify", marginTop: "4.5%", borderRight: "1px solid lightGrey"}}>
                        <p style={{height: "100%", paddingLeft: "2%", paddingRight: "2%", background: "LightGrey"}}>
                            {handleHTML(props.Answer)}
                        </p>
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