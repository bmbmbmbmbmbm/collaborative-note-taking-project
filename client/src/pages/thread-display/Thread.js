import React, { useEffect, useState } from 'react';
import { Container, Card, Tabs, Tab } from 'react-bootstrap';
import Reply from './Reply';

export default function Thread(props) {
    const [threadData, setThreadData] = useState();
    const [showReply, setShowReply] = useState(false);

    useEffect(() => {
        if(props.isRoot) {
            fetch("/threads/view/1").then(
                response => response.json()
            ).then(
                data => {
                    setThreadData(data);
                }
            )
        }
    }, []);

    return ( 
        <>
            {props.isRoot ? 
                (typeof threadData === 'undefined'?
                    <Container>
                        <h1>Loading...</h1>
                    </Container>

                :
                    <Container>
                        <div className="thread" style={{paddingTop:'1%'}}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        {threadData.title}
                                    </Card.Title>
                                    <Card.Subtitle>
                                        {threadData.user}
                                    </Card.Subtitle>
                                    <Card.Text>
                                        {threadData.content}
                                    </Card.Text>
                                    <Card.Link>Pin</Card.Link>
                                    <Card.Link>Report</Card.Link>
                                </Card.Body>
                            </Card>
                            
                            <Reply 
                                comments={threadData.comments}
                                parentId={threadData.id}    
                            />

                            {threadData.comments.map(comment => 
                                <Thread
                                    key={comment.user + comment.content}
                                    isRoot={false}
                                    comment={comment}
                                />    
                            )}
                            
                        </div>
                    </Container>
                )
            : 
                <div className="comment" style={{paddingTop: "1%"}}>
                    <Card bg={((props.comment.id.replace(/[^:]/g, "").length) % 2 === 0) ? "light" : ""}>
                        <Tabs defaultActiveKey="show">
                            <Tab eventKey="show" title="Show">
                                <Card.Body>
                                    <Card.Subtitle>
                                        {props.comment.user}
                                    </Card.Subtitle>
                                    <Card.Text>
                                        {props.comment.content}
                                    </Card.Text>
                                    <Card.Link onClick={() => setShowReply(!showReply)}>Reply</Card.Link>
                                    <Card.Link>Report</Card.Link>
                                    {showReply && 
                                        <Reply 
                                            comments={props.comment.comments} 
                                            parentId={props.comment.id}
                                        />
                                    }
                                    {props.comment.comments.map(comment => 
                                        <Thread
                                            key={comment.content + comment.user}
                                            isRoot={false}
                                            comment={comment}
                                        />      
                                    )}
                                </Card.Body>
                            </Tab>
                            <Tab eventKey="hide" title="Hide">
                                <Card.Body>
                                    <Card.Text>
                                        Hidden comment by {props.comment.user}
                                    </Card.Text>
                                </Card.Body>
                            </Tab>
                        </Tabs>              
                    </Card>
                </div>
            }
        </>
     );
}

