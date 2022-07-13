import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { createEditor, Transforms, Editor, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { Tabs, Tab, Form, Container, Button, Col, Row, ButtonGroup, ToggleButton } from 'react-bootstrap';

export default function EntryCreator({ token }) {
    const [title, setTitle] = useState("");
    const [units, setUnits] = useState([]);
    const [chosen, setChosen] = useState(0);
    const [entryId, setEntryId] = useState();

    const user = "bm639"

    useEffect(() => {
        fetch(`/subject/units/user/${user}`)
            .then(
                response => response.json()
            ).then(
                data => setUnits(data)
            );
    }, [])

    const editor = useMemo(() => withReact(createEditor()), [])

    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])

    const initialValue = useMemo(
        () =>
            JSON.parse(localStorage.getItem('content')) || [
                {
                    type: 'paragraph',
                    children: [{ text: 'A line of text in a paragraph.' }],
                },
            ],
        []
    )


    function handleSave(event) {
        event.preventDefault();

        if (chosen === 0) {
            alert("Choose a valid unit")
        } else if (entryId !== undefined) {
            let body = {
                username: user,
                title: title,
                entry: initialValue,
                unitCode: units[chosen].code,
                private: true
            }
            fetch('/entry/create', {
                method: "POST",
                headers: {
                    "x-access-token": token,
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
                username: user,
                title: title,
                entry: initialValue,
                unitCode: units[chosen].code,
                private: true,
                entryId: entryId
            }
            fetch('/entry/create', {
                method: "PUT",
                headers: {
                    "x-access-token": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }).then(
                response => response.json()
            ).then(
                data => setEntryId(data.id)
            )
        }
    }

    if (initialValue) {
        return (
            <Form onSubmit={handleSave}>
                <div className="settings" style={{ backgroundColor: "white", padding: "0.3%" }}>
                    <Row style={{ paddingBottom: "0.5%", paddingTop: "0.5%" }}>
                        <Col xs={5}>
                            <Form.Control autoFocus type="text" placeholder="Entry title" onChange={(e) => setTitle(e.target.value)} required />
                        </Col>
                        <Col xs={4}>
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
                            <Button type="submit">Save</Button>
                        </Col>
                        <Col xs={2} className="d-grid gap-2">
                            <Button variant="success">Save and Submit</Button>
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

                                    <BlockButton type="block-quote" name="Block Quote" />
                                    <BlockButton type="numbered-list" name="Numbered List" />
                                    <BlockButton type="bulleted-list" name="Bulleted List" />
                                    <MarkButton type="image" name="Image" />

                                    <MarkButton type="code" name="Code" />
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
                    <Container style={{ backgroundColor: "white", minHeight: '100vh', marginTop: "3%", padding: "7.5%", boxShadow: "0 0 3px black" }}>
                        <Editable renderElement={renderElement} renderLeaf={renderLeaf} onKeyDown={event => onKeyDown(event, editor)} />
                    </Container>
                </Slate>

            </Form>
        )
    }

    return (<></>)
}

function onChange(value, editor) {
    const isAstChange = editor.operations.some(op => 'set_selection' !== op.type);
    if (isAstChange) {
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

        case 'p':
            event.preventDefault();
            toggleMark(editor, 'image');
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
            return (
                <img alt="" src={children} />
            )
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
        children = <div className="code"><code>{children}</code></div>
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

    if (leaf.img) {
        console.log("Poop")
        children = <img alt="" src={children} />
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
    let newProperties = <SlateElement />;
    newProperties = {
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