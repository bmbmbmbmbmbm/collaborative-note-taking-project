import React from 'react';
import { Badge, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export default function Post({ isEntry, id, title, user, created, updated, code, positive, negative }) {
  return (
    <div className="post" style={{ marginBottom: "0.5%", paddingBottom: "0.5%", borderBottom: "1px solid lightgrey"}}>
      <h5><Link to={`/${code}/${id}`}>{title}</Link></h5>
      <h6><Link to={`/${code}`}>{code}</Link></h6>
      <label>Created by <Link to={`profile/${user}`}>{user}</Link></label>
      <label>Submitted {created}  Updated {updated}</label>
      <label>{positive - negative}</label>
    </div>
  );
}
