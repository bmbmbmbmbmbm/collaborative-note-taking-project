import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { createEditor, Transforms } from 'slate';
import { Slate, Editable, useSlateStatic, ReactEditor, useSelected, useFocused, withReact } from 'slate-react';
import imageExtensions from 'image-extensions';
import isUrl from 'is-url';
import { withHistory } from 'slate-history';
import { Tabs, Tab, Container, Row, Col } from 'react-bootstrap';
import Reply from '../thread-display/Reply.js';
import Comment from '../thread-display/Comment.js';
import { useParams, Link } from 'react-router-dom';
import Prompt from '../../components/Prompt.js';
import Edit from './Edit';

export default function Entry({ user }) {
    const editor = useMemo(() => withImages(withHistory(withReact(createEditor()))), [])
    const [entry, setEntry] = useState([{}]);
    const [title, setTitle] = useState("");
    const [username, setUsername] = useState("");
    const [created, setCreated] = useState("");
    const [updated, setUpdated] = useState("");
    const [unit, setUnit] = useState("");
    const [interactions, setInteractions] = useState({ comments: [], replies: [] })
    const [userEdits, setUserEdits] = useState([])

    const params = useParams();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if(token) {
            fetch(`/entry/view/${params.entryId}`, {
                method: "GET",
                headers: {
                    "authorization": token,
                    'Content-Type': 'application/json'
                }
            }).then(
                response => response.json()
            ).then(
                data => {
                    setTitle(data.title);
                    setEntry(data.entry);
                    setUsername(data.username);
                    setCreated(data.created);
                    setUpdated(data.updated);
                    setUnit(data.unit_code);
                }
            )
    
            fetch(`/entry/view/${params.entryId}/replies`, {
                method: "GET",
                headers: {
                    "authorization": token
                }
            }).then(
                response => response.json()
            ).then(
                data => setInteractions(data)
            )
    
            fetch(`/entry/edit-suggestions/${params.entryId}`, {
                method: "GET",
                headers: {
                    "authorization": token
                }
            }).then(
                response => response.json()
            ).then(
                data => setUserEdits(data)
            )
        }
    }, [])

    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])

    function isHeading(element) {
        return element.type.includes("heading")
    }

    function headingType(type) {
        switch (type) {
            case "heading-one":
                return "1";
            case "heading-two":
                return "2";
            case "heading-three":
                return "3";
            case "heading-four":
                return "4";
            case "heading-five":
                return "5";
            default:
                return "";
        }
    }

    function createContents() {
        const messyContents = entry.filter(isHeading);
        var refinedContents = [""];
        for (let i = 0; i < messyContents.length; ++i) {
            for (let j = 0; j < messyContents[i].children.length; ++j) {
                refinedContents[i] = refinedContents[i] + messyContents[i].children[j].text;
            }
            if (refinedContents[i].includes("undefined")) {
                refinedContents[i] = refinedContents[i].substring(9);
            }
            refinedContents[i] = headingType(messyContents[i].type) + refinedContents[i];
        }
        return refinedContents;
    }

    return (
        <div className='entry'>

            {(typeof entry[0].type === 'undefined') ?
                <p>Loading</p>
                :
                <>
                    <div className="header" style={{ backgroundColor: "white" }}>
                        <Container>
                            <h1>{title}</h1>
                            <Row>
                                <Col>
                                    <h4>By <Link to={`/profile/${username}`}>{username}</Link></h4>
                                </Col>
                                <Col>
                                    <h4 style={{ "float": "right" }}>Submitted to <Link to={`/${unit}`}>{unit}</Link></h4>
                                </Col>
                            </Row>
                            <label>Created: {created} - {updated.length > 0 && <>Updated: {updated}</>}</label>

                        </Container>
                    </div>
                    <style type="text/css">
                        {`
                            .tabs {
                                background-color: white;
                                justify-content: center;
                            }
                            
                        `}
                    </style>
                    <Tabs defaultActiveKey="document" className="tabs">
                        <Tab eventKey="document" title="Entry">
                            <Container style={{ backgroundColor: "white" }}>
                                <div className='contents' style={{ borderBottom: "1px solid lightgrey", paddingBottom: "1%", marginBottom: "1%" }}>
                                    <style type="text/css">
                                        {`
                                            .head-1 {
                                                display: block;
                                                margin-left: 0px;
                                            }
                                            .head-2 {
                                                display: block;
                                                margin-left: 20px;
                                            }
                                            .head-3 {
                                                display: block;
                                                margin-left: 40px;
                                            }
                                            .head-4 {
                                                display: block;
                                                margin-left: 60px;
                                            }
                                            .head-5 {
                                                display: block;
                                                margin-left: 80px;
                                            }
                                        `}
                                    </style>
                                    <h5>Contents</h5>
                                    {createContents().map(heading =>
                                        <a key={heading.substring(1)} className={`head-${heading.charAt(0)}`} href={`#${heading.substring(1)}`}>{heading.substring(1, 50)}</a>
                                    )}
                                </div>
                                <Slate editor={editor} value={entry}>
                                    <Editable readOnly renderElement={renderElement} renderLeaf={renderLeaf} placeholder='Some text' />
                                </Slate>

                            </Container>
                        </Tab>
                        <Tab eventKey="Discussion" title="Discussion">
                            <Container>
                                <div className="reply" style={{ marginBottom: "2%" }}>
                                    <Reply Id={params.entryId} depth={0} isThread={false} />
                                </div>

                                {interactions.comments.map(comment =>
                                    <Comment key={comment.id} id={comment.id} threadId={params.threadId} content={comment.reply.content} user={comment.username} created={comment.created} replies={interactions.replies} depth={0} isThread={false}/>
                                )}
                            </Container>
                        </Tab>
                        <Tab eventKey="Suggested Edits" title="Suggested Edits">
                            <Container>
                                <Prompt title="Why not make an edit?" desc="Others, including the author, may find it useful" link={`/${params.unitId}/entry/${params.entryId}/edit`} />
                                {userEdits.map(theEdit =>
                                    <Edit key={theEdit.username} user={theEdit.username} created={theEdit.created} suggestion={theEdit.edit} />
                                )}
                            </Container>
                        </Tab>
                    </Tabs>
                </>
            }
        </div >
    );
}

function withImages(editor) {
    const { insertData, isVoid } = editor

    editor.isVoid = element => {
        return element.type === 'image' ? true : isVoid(element)
    }

    editor.insertData = data => {
        const text = data.getData('text/plain')
        const { files } = data

        if (files && files.length > 0) {
            for (const file of files) {
                const reader = new FileReader()
                const [mime] = file.type.split('/')

                if (mime === 'image') {
                    reader.addEventListener('load', () => {
                        const url = reader.result
                        insertImage(editor, url)
                    })

                    reader.readAsDataURL(file)
                }
            }
        } else if (isImageUrl(text)) {
            insertImage(editor, text)
        } else {
            insertData(data)
        }
    }

    return editor
}

function insertImage(editor, url) {
    const text = { text: '' };
    const image = { type: 'image', url, children: [text] };
    Transforms.insertNodes(editor, image);
}

function Image({ attributes, children, element }) {
    const editor = useSlateStatic()
    const path = ReactEditor.findPath(editor, element)

    const selected = useSelected()
    const focused = useFocused()
    return (
        <div {...attributes}>
            {children}
            <div
                contentEditable={false}
            >
                <style type="text/css">
                    {`
                        .userImage {
                            display: block;
                            max-width: 100%;
                            margin-left: auto;
                            margin-right: auto;
                            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
                        }
                    `}
                </style>
                <img
                    className='userImage'
                    alt="Figure"
                    src={element.url}
                />
            </div>
        </div>
    )
}

function isImageUrl(url) {
    if (!url) return false
    if (!isUrl(url)) return false
    const ext = new URL(url).pathname.split('.').pop()
    return imageExtensions.includes(ext)
}

function listToString(children) {
    var str = "";
    for (var i = 0; i < children.length; ++i) {
        str += children[i].props.text.text;
    }
    return str;
}

function Element({ attributes, children, element }) {
    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote {...attributes}>
                    {children}
                </blockquote>
            )
        case 'bulleted-list':
            return (
                <ul  {...attributes}>
                    {children}
                </ul>
            )
        case 'heading-one':
            return (
                <h1  {...attributes} id={`${listToString(children)}`}>
                    <a href={`${listToString(children)}`}>{children}</a>

                </h1>
            )
        case 'heading-two':

            return (
                <h2  {...attributes} id={`${listToString(children)}`}>
                    <a href={`${listToString(children)}`}>{children}</a>
                </h2>
            )
        case 'heading-three':
            return (
                <h3 {...attributes} id={`${listToString(children)}`}>
                    <a href={`${listToString(children)}`}>{children}</a>
                </h3>
            )
        case 'heading-four':
            return (
                <h4 {...attributes} id={`${listToString(children)}`}>
                    <a href={`${listToString(children)}`}>{children}</a>
                </h4>
            )
        case 'heading-five':
            return (
                <h5 {...attributes} id={`${listToString(children)}`}>
                    <a href={`${listToString(children)}`}>{children}</a>
                    {children}
                </h5>
            )
        case 'list-item':
            return (
                <li  {...attributes}>
                    {children}
                </li>
            )
        case 'numbered-list':
            return (
                <ol  {...attributes}>
                    {children}
                </ol>
            )
        case 'image':
            var props = { attributes, children, element };
            return <Image {...props} />

        default:
            return (
                <p  {...attributes}>
                    {children}
                </p>
            )
    }
}



function Leaf({ attributes, children, leaf }) {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    if (leaf.subscript) {
        children = <sub>{children}</sub>
    }

    if (leaf.superscript) {
        children = <sup>{children}</sup>
    }

    return <span {...attributes}>{children}</span>
}