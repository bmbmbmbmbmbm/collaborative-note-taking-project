import React from 'react';
import React, { useMemo, useCallback } from 'react';
import { createEditor, Transforms } from 'slate';
import { Slate, Editable, useSlateStatic, ReactEditor, useSelected, useFocused, withReact } from 'slate-react';
import imageExtensions from 'image-extensions';
import isUrl from 'is-url';
import { withHistory } from 'slate-history';

export default function UserEdit({ theEdit, user, time }) {
    const editor = useMemo(() => withImages(withHistory(createEditor())), [])
    const renderElement = useCallback(props => <Element {...props} />, []);
    const renderLeaf = useCallback(props => <Leadf {...props} />, []);

    return (
        <>
            {(typeof theEdit === 'undefined') ?
                <p>Loading</p>
                :
                <div className={user + "edit"}>
                    <Slate editor={editor} value={theEdit}>
                        <Editable readOnly renderElement={renderElement} renderLeaf={renderLeaf} placeholder='Loading' />
                    </Slate>
                    <h4>Suggested by {user} at {time}</h4>
                </div>
            }
        </>
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

    return <span {...attributes}>{children}</span>
}