import React, { useMemo, useCallback } from 'react';
import { createEditor, Transforms, Editor, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { Button, Toolbar } from './RichComponents.tsx';
import { Tabs, Tab } from 'react-bootstrap';

export default function RichTextEditor() {
    const editor = useMemo(() => withReact(createEditor()), [])

    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])

    const initialValue = useMemo(() => JSON.parse(localStorage.getItem('content')), [])

    if(initialValue) {
        return (
            <Slate editor={editor} value={initialValue} onChange={value => onChange(value, editor)}>
                <Tabs defaultActiveKey="stylings" className="mb-3">
                    <Tab eventKey="stylings" title="Stylings">
                    <Toolbar>
                        
                        <MarkButton type="bold" name="Bold" />
                        <MarkButton type="italic" name="Italic" />
                        <MarkButton type="underline" name="Underline" />
                        
                        <BlockButton type="block-quote" name="Block Quote" />
                        <BlockButton type="numbered-list" name="Numbered List" />
                        <BlockButton type="bulleted-list" name="Bulleted List" />
                        <BlockButton type="image" name="Image" />
    
                        <MarkButton type="code" name="Code"/>
                    </Toolbar>
                    </Tab>
                    <Tab eventKey="headings" title="Headings">
                    <Toolbar>    
    
                        <BlockButton type="heading-one" name="Heading 1" />
                        <BlockButton type="heading-two" name="Heading 2" />
                        <BlockButton type="heading-three" name="Heading 3" />
                        <BlockButton type="heading-four" name="Heading 4" />
                        <BlockButton type="heading-five" name="Heading 5" />
                    </Toolbar>
                    </Tab>
                </Tabs>
                <Editable renderElement={renderElement} renderLeaf={renderLeaf} onKeyDown={event => onKeyDown(event, editor)}/>
            </Slate>
        )
    }
    
    return(<></>)
}

function onChange(value, editor) {
    const isAstChange = editor.operations.some(op => 'set_selection' !== op.type);
    if(isAstChange) {
        const content = JSON.stringify(value);
        localStorage.setItem('content', content);
    }
    console.log("poopy");
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
            toggleBlock(editor, 'image');
            break;
        
        default:
            break;
    }
}

function Element({attributes, children, element}) {
    switch(element.type) {
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

function Leaf({attributes, children, leaf}) {
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
    let newProperties = <SlateElement/>;
    newProperties = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : type,
    }

    Transforms.setNodes(
        editor,
        newProperties,
    );

    if(!isActive && isList) {
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

    if(isActive) {
        Editor.removeMark(editor, type);
    }
    else {
        Editor.addMark(editor, type, true);
    }
}

function BlockButton({type, name}) {
    const editor = useSlate();
    return (
        <Button
            active={isBlockActive(editor, type)}
            onMouseDown={event => {
                event.preventDefault();
                toggleBlock(editor, type);
            }}
        >
            {hasIcon(type, name)}
        </Button>
    )
}

function MarkButton({type, name}) {
    const editor = useSlate();
    return (
        <Button
            active={isMarkActive(editor, type)}
            onMouseDown={event => {
                event.preventDefault();
                toggleMark(editor, type);
            }}
        >
            {hasIcon(type, name)}
        </Button>
    )
}

function hasIcon(type, name) {
    switch(type) {
        case 'bold':
            return <b>B</b>
        case 'italic':
            return <i>I</i>
        case 'underline':
            return  <u>U</u>
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