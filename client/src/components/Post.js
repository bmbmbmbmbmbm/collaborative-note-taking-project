import React from 'react';
import { Badge, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default function Post({ isEntry, id, title, user, created, updated, code, positive, negative, unitTitle }) {
  return (
    <Card className="post" style={{ marginBottom: "0.5%", paddingBottom: "0.5%", borderBottom: "1px solid lightgrey" }}>
      <Card.Body>
        <Row>
          <Col xs={1}>
            <img
              alt={isEntry ? "entry icon" : "thread icon"} 
              src={isEntry ? "https://i.imgur.com/dHNsRsV.png" : "https://i.imgur.com/NGmwoxe.png"}
            />
          </Col>
          <Col>
            <h4><Link to={`/${code}/${id}`}>{title}</Link></h4>
            <h6><Link to={`/${code}`}>{code} - {unitTitle}</Link></h6>
            <h6>Created by <Link to={`profile/${user}`}>{user}</Link></h6>
            <label>Submitted {created} - Updated {updated}</label>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
