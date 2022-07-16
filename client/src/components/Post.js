import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default function Post({ isEntry, id, title, user, created, updated, code, positive, negative, unitTitle }) {
  return (
    <>
      <style type='text/css'>
        {`
          .post {
            margin-bottom: 0.5%;
            padding-bottom: 0.5%;
            border-bottom: 1px solid lightgrey;
          }
          .post:hover {
            box-shadow: 0px 0px 0px 3px #34abeb;
          }
        `}
      </style>
      <Card className="post">
        <Card.Body>
          <h4><Link to={`/${code}/${id}`}>{title}</Link> <Badge style={{ float: "right" }} variant={isEntry ? "primary" : "danger"}>{isEntry ? "Entry" : "Thread"}</Badge></h4>
          <h6><Link to={`/${code}`}>{code} - {unitTitle}</Link></h6>
          <h6>Created by <Link to={`profile/${user}`}>{user}</Link></h6>
          <label>{created === updated ? `Submitted ${created}` : `Submitted ${created} - Updated ${updated}`}</label>
        </Card.Body>
      </Card>
    </>
  );
}
