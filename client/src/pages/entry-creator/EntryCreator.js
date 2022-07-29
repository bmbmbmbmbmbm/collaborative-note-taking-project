import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { createEditor, Transforms, Editor } from 'slate';
import { Slate, Editable, useSlate, useSlateStatic, ReactEditor, useSelected, useFocused, withReact } from 'slate-react';
import imageExtensions from 'image-extensions';
import isUrl from 'is-url';
import { withHistory } from 'slate-history';
import { Tabs, Tab, Form, Container, Button, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import v from '../../components/validation';

export default function EntryCreator({ token, user }) {
    const [title, setTitle] = useState("");
    const [units, setUnits] = useState([]);
    const [chosen, setChosen] = useState(0);
    const [entryId, setEntryId] = useState();
    const [isPublic, setIsPublic] = useState(false);

    const initialValue = useMemo(() => JSON.parse(localStorage.getItem('content')) || [{ type: 'paragraph', children: [{ text: 'A line of text in a paragraph.' }],}] || [], []);

    const editor = useMemo(() => withImages(withHistory(withReact(createEditor()))), []);

    const params = useParams();

    useEffect(() => {
        fetch(`/subject/get-units/${user}`)
            .then(
                response => response.json()
            ).then(
                data => setUnits(data)
            );


        if (entryId === undefined && params.entryId !== undefined) {
            setEntryId(params.entryId);
            fetch(`/entry/edit/${params.entryId}`, {
                method: "PUT",
                headers: {
                    "authorization": token,
                    "Content-Type": "application/json"
                }
            })
                .then(
                    response => response.json()
                ).then(
                    data => {
                        setTitle(data.title);
                        setChosen(units.indexOf({title: data.unitTitle, code: data.unit_code}) + 1);
                        localStorage.setItem('content', JSON.stringify(data.entry));
                    }
                )
        } 
        
    }, [])

    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])


    function handleSave(event) {
        event.preventDefault();

        if (chosen === 0) {
            alert("Choose a valid unit")
        } else if (entryId === undefined) {

            let body = {
                title: title,
                entry: JSON.parse(localStorage.getItem('content')),
                unitCode: units[chosen - 1].code,
                private: isPublic
            }
            fetch('/entry/create', {
                method: "POST",
                headers: {
                    "authorization": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }).then(
                response => response.json()
            ).then(
                data => setEntryId(data.id)
            )
        } else {
            let body = {
                title: title,
                entry: JSON.parse(localStorage.getItem('content')),
                unitCode: units[chosen - 1].code,
                private: isPublic,
                entryId: entryId
            }
            fetch('/entry/update', {
                method: "PUT",
                headers: {
                    "authorization": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
        }
    }

    function validation() {
        return v.validTitle(title) && chosen > 0;
    }

    if (initialValue) {
        return (
            <Form onSubmit={handleSave}>
                <div className="settings" style={{ backgroundColor: "white", padding: "0.3%" }}>
                    <Row style={{ paddingBottom: "0.5%", paddingTop: "0.5%" }}>
                        <Col xs={7}>
                            <Form.Control autoFocus type="text" placeholder="Entry title" onChange={(e) => setTitle(e.target.value)} required />
                        </Col>
                        <Col xs={3}>
                            <Form.Select onChange={(e) => setChosen(e.target.value)} required>
                                <option value={0}>What unit are you writing about?</option>
                                {units.map((unit, index) => (
                                    <option key={unit.code} value={index + 1}>
                                        {unit.title}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col xs={1} className="d-grid gap-2">
                            <Button type="submit" disabled={!validation()}>Save</Button>
                        </Col>
                        <Col xs={1} className="d-grid gap-2">
                            <Button variant={isPublic ? "warning" : "success"} onClick={() => setIsPublic(!isPublic)}>{isPublic ? "Make Private" : "Make Public"}</Button>
                        </Col>
                    </Row>
                </div>

                <Slate editor={editor} value={initialValue} onChange={value => onChange(value, editor)}>
                    <div className="textFeatures" style={{ backgroundColor: "white" }}>
                        <Tabs defaultActiveKey="stylings" className="mb-3" style={{ paddingLeft: "0.3%" }}>
                            <Tab eventKey="stylings" title="Stylings">
                                <div style={{ borderBottom: "1px solid #d3d3d3", paddingBottom: "0.5%", paddingLeft: "0.3%", paddingRight: "0.3%" }}>
                                    <MarkButton type="bold" name="Bold" />
                                    <MarkButton type="italic" name="Italic" />
                                    <MarkButton type="underline" name="Underline" />
                                    <InsertImageButton />
                                    <MarkButton type="code" name="Code" />
                                    <BlockButton type="block-quote" name="Block Quote" />
                                    <BlockButton type="numbered-list" name="Numbered List" />
                                    <BlockButton type="bulleted-list" name="Bulleted List" />
                                </div>
                            </Tab>
                            <Tab eventKey="headings" title="Headings">
                                <div style={{ borderBottom: "1px solid #d3d3d3", paddingBottom: "0.5%" }}>
                                    <BlockButton type="heading-one" name="Heading 1" />
                                    <BlockButton type="heading-two" name="Heading 2" />
                                    <BlockButton type="heading-three" name="Heading 3" />
                                    <BlockButton type="heading-four" name="Heading 4" />
                                    <BlockButton type="heading-five" name="Heading 5" />
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                    <style type="text/css">
                        {`
                            .page {
                                background-color: white;
                                min-height: 100vh;
                                margin-top: 3%;
                                padding: 7.5%;
                                border: 1px solid lightgrey;
                            }
                            .page:hover {
                                box-shadow: 0px 0px 5px 0px lightgrey;
                            }
                        `}
                    </style>
                    <Container className='page'>
                        <Editable renderElement={renderElement} renderLeaf={renderLeaf} onKeyDown={event => onKeyDown(event, editor)} />
                    </Container>
                </Slate>
            </Form>
        )
    }

    return (<></>)
}
  

// Start of handling images

// Code adapted from: Slate; 2022; Available from: https://github.com/ianstormtaylor/slate/blob/main/site/examples/images.tsx; [22/07/2022]
// Originally written in TypeScript, was adapted for JavaScript usage

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
                        .inlineButton {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            background-color: white;
                        }
                        .inlineButton:hover {
                            background-color: blue;
                        }
                    `}
                </style>
                <img
                    className='userImage'
                    alt="Figure"
                    src={element.url}
                />
                <Button
                    onClick={() => Transforms.removeNodes(editor, { at: path })}
                    variant="inlineButton"
                >
                    Delete
                </Button>
            </div>
        </div>
    )
}

function InsertImageButton() {
    const editor = useSlateStatic()
    return (
        <>
            <style type="text/css">
                {`
                    .btn-plain {
                        background-color: white;
                        color: grey;
                    }
                    .btn-plain:hover {
                        background-color: lightgrey
                    }
                `}
            </style>
            <Button
                onMouseDown={event => {
                    event.preventDefault()
                    const url = window.prompt('Enter an image url')
                    if (url && !isImageUrl(url)) {
                        alert('URL is not an image')
                        return
                    } else if (url) {
                        insertImage(editor, url)
                    }
                }}
                variant='plain'
            >
                image
            </Button>
        </>
    )
}

function isImageUrl(url) {
    if (!url) return false
    if (!isUrl(url)) return false
    const ext = new URL(url).pathname.split('.').pop()
    return imageExtensions.includes(ext)
}

// End of handling Images

function onChange(value, editor) {
    console.log(value);
    const isAChange = editor.operations.some(op => 'set_selection' !== op.type);
    if (isAChange) {
        console.log("hello")
        const content = JSON.stringify(value);
        localStorage.setItem('content', content);
    }
}

function onKeyDown(event, editor) {
    if (!event.ctrlKey) {
        return
    }

    // Replace the `onKeyDown` logic with our new commands.
    switch (event.key) {
        case '`':
            event.preventDefault();
            toggleMark(editor, 'code');
            break;

        case 'b':
            event.preventDefault();
            toggleMark(editor, 'bold');
            break;

        case '.':
            event.preventDefault();
            toggleMark(editor, 'subscript');
            break;

        case ',':
            event.preventDefault();
            toggleMark(editor, 'superscript');
            break;

        case 'u':
            event.preventDefault();
            toggleMark(editor, 'underline');
            break;

        case 'i':
            event.preventDefault();
            toggleMark(editor, 'italic');
            break;

        case '1':
            event.preventDefault();
            toggleBlock(editor, 'heading-one');
            break;

        case '2':
            event.preventDefault();
            toggleBlock(editor, 'heading-two');
            break;

        case '3':
            event.preventDefault();
            toggleBlock(editor, 'heading-three');
            break;

        case '4':
            event.preventDefault();
            toggleBlock(editor, 'heading-four');
            break;

        case '5':
            event.preventDefault();
            toggleBlock(editor, 'heading-five');
            break;

        default:
            break;
    }
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
                <h1  {...attributes}>
                    {children}
                </h1>
            )
        case 'heading-two':
            return (
                <h2  {...attributes}>
                    {children}
                </h2>
            )
        case 'heading-three':
            return (
                <h3 {...attributes}>
                    {children}
                </h3>
            )
        case 'heading-four':
            return (
                <h4 {...attributes}>
                    {children}
                </h4>
            )
        case 'heading-five':
            return (
                <h5>
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

function isBlockActive(editor, type) {
    const [match] = Editor.nodes(editor, {
        match: n => n.type === type,
    });

    return !!match;
}

const LIST_TYPES = ['bulleted-list', 'numbered-list']

function toggleBlock(editor, type) {
    const isActive = isBlockActive(editor, type);

    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) &&
            LIST_TYPES.includes(n.type),
        split: true,
    });

    const isList = LIST_TYPES.includes(type);
    let newProperties = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : type,
    }

    Transforms.setNodes(
        editor,
        newProperties,
    );

    if (!isActive && isList) {
        const block = { type: type, children: [] }
        Transforms.wrapNodes(editor, block);
    }
}

function isMarkActive(editor, type) {
    const marks = Editor.marks(editor);
    return marks ? marks[type] === true : false;
}

function toggleMark(editor, type) {
    const isActive = isMarkActive(editor, type);

    if (isActive) {
        Editor.removeMark(editor, type);
    }
    else {
        Editor.addMark(editor, type, true);
    }
}

function BlockButton({ type, name }) {
    const editor = useSlate();
    return (
        <>
            <style type="text/css">
                {`
                    .btn-plain {
                        background-color: white;
                        color: grey;
                    }
                `}
            </style>
            <Button
                variant={isBlockActive(editor, type) ? "success" : "plain"}
                onMouseDown={event => {
                    event.preventDefault();
                    toggleBlock(editor, type);
                }}
            >
                {hasIcon(type, name)}
            </Button>
        </>
    )
}

function MarkButton({ type, name }) {
    const editor = useSlate();
    return (
        <>
            <style type="text/css">
                {`
                    .btn-plain {
                        background-color: white;
                        color: grey;
                    }
                    .btn-plain:hover {
                        background-color: lightgrey
                    }
                `}
            </style>
            <Button
                variant={isMarkActive(editor, type) ? "success" : "plain"}
                onMouseDown={event => {
                    event.preventDefault();
                    toggleMark(editor, type);
                }}
            >
                {hasIcon(type, name)}
            </Button>
        </>
    )
}

function hasIcon(type, name) {
    switch (type) {
        case 'bold':
            return <b>B</b>
        case 'italic':
            return <i>I</i>
        case 'underline':
            return <u>U</u>
        case 'code':
            return <code>code</code>
        case 'block-quote':
            return <span>"Q"</span>
        case 'numbered-list':
            return <span>1. list</span>
        case 'bulleted-list':
            return <span>• list</span>
        case 'image':
            return <span>img</span>
        default:
            return <span>{name}</span>
    }
}

