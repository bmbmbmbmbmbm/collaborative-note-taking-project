import React from 'react';
import { Tabs, Tab, Badge } from 'react-bootstrap';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import Thread from '../thread-display/Thread.js'

export default function Entry(props) {

    function handleHTML(parseMe) {
        const santized = DOMPurify.sanitize(parseMe);
        return (parse(santized));
    }

    return (
        <div className='entry'>
            <h1>
                {props.title}
                {props.isPrivate && <Badge bg="success" md="auto" style={{marginLeft: "0.5%"}}>Private</Badge>}
            </h1>
            <h5>
                {props.tags.map(tag => 
                    <Badge bg="light" text="dark" key={tag} md="auto" style={{marginRight: "0.2%"}}>{tag}</Badge>
                )}
            </h5>
            <h5>
                By Name 
            </h5>
            
            <Tabs defaultActiveKey="entry" className="mb-3">

                <Tab eventKey="entry" title="Entry">
                    {handleHTML(props.data)}
                </Tab>

                {props.includesReferences && 
                    <Tab eventKey="references" title="References">
                        <p>{props.references}</p>
                    </Tab>
                }

                {!props.isPreview && 
                    <Tab eventKey="editHistory" title="Edit History">

                    </Tab>
                }
                {!props.isPreview &&
                    <Tab eventKey="discussion" title="Discussion">
                        <Thread isRoot={true} user="Edit Suggestions" title="" content="What could be improved?" tags={[]}/>
                        <Thread isRoot={true} user="References" title="" content="Are references missing or needed?" tags={[]}/>
                        <Thread isRoot={true} user="Praise" title="" content="What's been done well" tags={[]}/>
                        <Thread isRoot={true} user="General Discussion" title="" content="General thoughts" tags={[]}/>
                    </Tab>
                }

            </Tabs>
            
        </div>
    );
    
}