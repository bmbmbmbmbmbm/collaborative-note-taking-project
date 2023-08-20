import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function UnitDisplay({ unitCode, title}) {
    return (  
        <Card className="unitDispaly" style={{marginBottom: "0.5%"}}>
            <Card.Header>
                {unitCode}
            </Card.Header>
            <Card.Body>
                <Card.Title>
                    <Link to={`/${unitCode}`}>{title}</Link>
                </Card.Title>
            </Card.Body>
        </Card>
    );
}