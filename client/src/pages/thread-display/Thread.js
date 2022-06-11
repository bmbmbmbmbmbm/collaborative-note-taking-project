import React, { useState } from 'react';
import { Card, Form, Button, InputGroup, Badge } from 'react-bootstrap';

function Thread(props) {
    const isRoot = props.isRoot;
    const [childThreads, setChildThreads] = useState([]);
    const [addComment, setAddComment] = useState(false);
    const [comment, setComment] = useState("");

    function submitComment(e) {
        e.preventDefault();
        
        let newThread = { content: comment, user: "eu002" };
        const currentThreads = [...childThreads, newThread];
        setChildThreads(currentThreads);
        console.log(currentThreads);
    }

    return ( 
        <div className="thread" style={{paddingTop:'1%'}}>
            <Card>
                <Card.Header>
                    {props.user}
                </Card.Header>
                <Card.Body>
                    <div className="title">  
                        <h1>{props.title}</h1>
                    </div>

                    <div className="tags">
                        {props.tags.map(tag => 
                            <Badge bg="light" text="dark" key={tag} md="auto" style={{marginRight: "0.2%"}}>{tag}</Badge>
                        )}
                    </div>

                    <div className="content" style={{marginTop: '0.5%'}}>
                        <p>{props.content}</p>
                    </div>

                    <div className="userOptions">
                        {isRoot && 
                            <>
                                <Card.Link>Pin</Card.Link>
                                <Card.Link>Report</Card.Link>
                            </>
                        }
                        {!isRoot && 
                            <>
                                <Card.Link onClick={() => setAddComment(!addComment)}>Add Comment</Card.Link>
                                <Card.Link>Report Comment</Card.Link>
                            </>
                        }
                    </div>

                    
                    <div className="threadAddComment">
                        {isRoot && 
                            <Card style={{marginTop: "1%"}}>
                                <Card.Body>
                                    <Form onSubmit={submitComment}>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                Thoughts?
                                            </InputGroup.Text>
                                            <Form.Control as="textarea" aria-label="With textarea" onChange={(e) => setComment(e.target.value)}/>
                                        </InputGroup>
                                        <Button variant="primary" type="submit" style={{marginTop: "1%"}}>
                                            Add Comment
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        }
                        {(!isRoot && addComment) &&
                            <Card style={{marginTop: "1%"}}>
                                <Card.Body>
                                    <Form onSubmit={submitComment}>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                Thoughts?
                                            </InputGroup.Text>
                                            <Form.Control as="textarea" aria-label="With textarea" onChange={(e) => setComment(e.target.value)}/>
                                        </InputGroup>
                                        <Button variant="primary" type="submit" style={{marginTop: "1%"}}>
                                            Add Comment
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        }

                    </div>

                    <div className="threadComments">

                        {childThreads.map( childThread => 
                            <Thread 
                                key={childThread.content + childThread.user}
                                isRoot={false} 
                                title={""} 
                                content={childThread.content} 
                                user={childThread.user}
                                tags={[]}
                            />)
                        }

                    </div>

                </Card.Body>
            </Card>
        </div>
     );
}

export default Thread;