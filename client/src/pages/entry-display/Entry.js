import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { createEditor, Transforms } from 'slate';
import { Slate, Editable, useSlateStatic, ReactEditor, useSelected, useFocused, withReact } from 'slate-react';
import imageExtensions from 'image-extensions';
import isUrl from 'is-url';
import { withHistory } from 'slate-history';
import { Tabs, Tab, Container, Button, ButtonGroup} from 'react-bootstrap';
import ThreadCreator from '../thread-creator/ThreadCreator.js';

export default function Entry() {
    const editor = useMemo(() => withImages(withHistory(withReact(createEditor()))), [])
    const [entry, setEntry] = useState([{}]);

    useEffect(() => {
        fetch("/entry/view/1").then(
            response => response.json()
        ).then(
            data => {
                setEntry(data)
            }
        )
    }, [])

    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])

    function isHeading(element) {
        return element.type.includes("heading")
    }

    function headingType(type){
        switch(type) {
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
        for(let i = 0; i < messyContents.length; ++i) {
            for(let j = 0; j < messyContents[i].children.length; ++j) {
                refinedContents[i] = refinedContents[i] + messyContents[i].children[j].text;
            }
            if(refinedContents[i].includes("undefined")){
                refinedContents[i] = refinedContents[i].substring(9);
            }
            refinedContents[i] = headingType(messyContents[i].type) + refinedContents[i];
        }
        return refinedContents;
    }

    return (
        <div className='entry'>
            <Container style={{backgroundColor: "white"}}>
                {(typeof entry[0].type === 'undefined') ? 
                    (<p>Loading</p>) 
                : 
                    <Tabs defaultActiveKey="document" className="mb-3">
                        <Tab eventKey="document" title="Entry">
                            <Slate editor={editor} value={entry}>
                                <Editable readOnly renderElement={renderElement} renderLeaf={renderLeaf} placeholder='Some text' />
                            </Slate>
                        </Tab>
                        <Tab eventKey="contents" title="Contents">
                            <ButtonGroup>
                                {createContents().map(heading => 
                                    <Button key={heading.substring(1)} className={`head-${heading.charAt(0)}`}>{heading.substring(1)}</Button>    
                                )}
                            </ButtonGroup>
                        </Tab>
                        <Tab eventKey="Discussion" title="Discussion">
                            <ThreadCreator isLoggedIn={true}/>
                        </Tab>
                    </Tabs>
                }
                
            </Container>
        </div>
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