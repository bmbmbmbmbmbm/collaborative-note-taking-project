import React from 'react';
import { Badge, Card } from 'react-bootstrap';


export default function Post(props) {
  const isEntry = props.isEntry;
  return (
    <div className="post" style={{ paddingTop: '1%' }} onClick={() => props.onClick(props.Path)}>
      <Card border="success" >
        <Card.Header>
          <Card.Title>
            {!isEntry && 
              <Badge bg="warning" style={{marginRight: '1%'}}>Thread</Badge>
            }
            {isEntry && 
              <Badge bg="danger" style={{marginRight: '1%'}}>Entry</Badge>
            }
            {props.Title}
            
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Subtitle>
            Created by {props.User}
          </Card.Subtitle>
          <Card.Text>
            {props.Content}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          {props.Tags.map(tag => 
              <Badge key={tag} bg="info" style={{marginRight: '0.5%'}}>{tag}</Badge>
          )}
        </Card.Footer>
      </Card>
    </div>
  );
}
