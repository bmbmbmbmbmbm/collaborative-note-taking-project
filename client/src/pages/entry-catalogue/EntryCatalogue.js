import React, { useState, useEffect } from 'react';
import Post from '../../components/Post.js';
import { Col, Row, ButtonGroup, ToggleButton, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function EntryCatalogue(props) {
    const [radioValue, setRadioValue] = useState(0);
    const [chosenOption, setOption] = useState(0);
    const [chosenFilter, setFilter] = useState(0);

    const posts = [
        {   
            user: "eu001", 
            title: "Arm Processors", 
            contentPreview: "some content", 
            tags: ["Arm Processors", "CPU", "RISK Processors"], 
            isEntry: true, 
            path: "/example-entry",
            id: 0
        },
        { 
            user: "eu002", 
            title: "How do I reference stuff?", 
            contentPreview: "I don't know how to reference papers", 
            tags: ["Referencing", "Library"], 
            isEntry: false, 
            path: "/example-thread",
            id: 1
        }
    ];

    const voteFilter = [
        { name: 'New', id: 0 },
        { name: 'Popular', id: 1 },
        { name: 'All-time', id: 2 },
    ];

    const postFitler = [
        { name: 'Both', id: 0 },
        { name: 'Threads', id: 1 },
        { name: 'Entries', id: 2 }
    ]

    const units = [
        { name: 'All', id: 0 },
        { name: 'General', id: 1},
        { name: 'Parallel Computing', id: 2 },
        { name: 'Networking', id: 3 },
        { name: 'Safety Critical Systems', id: 4 },
        { name: 'Semantics of Programming Languages', id: 5 },
        { name: 'Cryptography', id: 6 },
        { name: 'Advanced Algorithms', id: 7 }
    ];

    const navigate = useNavigate();
    
    useEffect(() => {
        if(props.isLoggedIn === false) {
            navigate("/site-access")
        }
    });

    function applyOptions() {
        return posts.filter(function(post) {
            if(chosenFilter === 0) return post;
            else if(chosenFilter === 1) return post.isEntry === false;
            else return post.isEntry === true;
        });
    }

    const redirect = (path) => {
        navigate(path);
        console.log(path);
    }

    return (
        <div className='entryCatalogue' style={{paddingRight: "0.606%"}}>
            <Row>
                <Col  md="3" style={{backgroundColor: '#DCDCDC', paddingLeft: "1%", minHeight: '100vh', height: '100vh'}}>
                    
                    <h1>
                        Options
                    </h1>
                    <h5>
                        Units
                    </h5>

                    <ButtonGroup vertical style={{minWidth: '100%', width: '100%'}}>
                        {units.map(unit =>
                            <Button key={unit.id}  variant={chosenOption === unit.id ? 'dark' : 'outline-dark'} style={{minWidth: '100%', width: '100%'}} onClick={() => setOption(unit.id)}>
                                {unit.name}
                            </Button>    
                        )}
                    </ButtonGroup>

                    <h5 style={{paddingTop: '2%'}}>
                        Viewing
                    </h5>

                    <ButtonGroup vertical style={{minWidth: '100%', width: '100%'}}>
                        {postFitler.map(type =>
                            <Button key={type.id}  variant={chosenFilter === type.id ? 'dark' : 'outline-dark'} style={{minWidth: '100%', width: '100%'}} onClick={() => setFilter(type.id)}>
                                {type.name}
                            </Button>    
                        )}
                    </ButtonGroup>

                </Col>
                <Col>

                    <Row>
                        <h1>
                            All Unit Entries
                        </h1>
                    </Row>

                    <Row>

                        <Col>
                            <label>Loaded {posts.length} results</label>
                        </Col>

                        <Col md="auto">
                            <ButtonGroup>
                                {voteFilter.map((option, idx) => (
                                    <ToggleButton
                                        key={idx}
                                        id={`radio-${idx}`}
                                        type='radio'
                                        variant='outline-success'
                                        name='radio'
                                        value={option}
                                        checked={radioValue === option.id}
                                        onChange={() => setRadioValue(option.id)}
                                    >
                                        {option.name}
                                    </ToggleButton>
                                ))}
                            </ButtonGroup>
                        </Col>
                        
                    </Row>

                    {applyOptions().map(post => 
                        <Post 
                            key={post.id}
                            isEntry={post.isEntry}
                            User={post.user}
                            Title={post.title}
                            Content={post.contentPreview}
                            Tags={post.tags}
                            Path={post.path}
                            needsBadge={true}
                            onClick={redirect}
                        />
                    )}

                </Col>
            </Row>
            
            
        </div>
        
    );
}