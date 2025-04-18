import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Alignment from '@tiptap/extension-text-align'
import React, { useEffect, useState } from 'react'

import styles from '../../styles/TipTop.module.css';
import { noteServices } from '@/services/client/note.client'
import { useAuth } from '@/Context/auth.context'

const MenuBar = () => {
  const { editor } = useCurrentEditor()
  const [editorContent, setEditorContent] = useState('')

  const handleUpdate = ({ editor }: { editor: any }) => {
    // Get content as HTML
    const html = editor.getHTML();
    // Get content as JSON (optional)
    const json = editor.getJSON();

    // Update state with the new content
    setEditorContent(html);

  };


  if (!editor) {
    return null
  }

  const buttonClass = "px-3 py-1.5 text-sm font-medium rounded border border-gray-300 hover:bg-gray-100 text-black"
  const activeButtonClass = "px-3 py-1.5 text-sm font-medium rounded border border-blue-500 bg-blue-100 text-cyan-700"

  return (
    <div className="p-2 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm backdrop-blur-sm">
      <div className="flex flex-wrap justify-center gap-1.5">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? activeButtonClass : buttonClass}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? activeButtonClass : buttonClass}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? activeButtonClass : buttonClass}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? activeButtonClass : buttonClass}
        >
          Code
        </button>
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className={buttonClass}
        >
          Clear marks
        </button>
        {/* <button 
          onClick={() => editor.chain().focus().clearNodes().run()}
          className={buttonClass}
        >
          Clear nodes
        </button> */}
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? activeButtonClass : buttonClass}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? activeButtonClass : buttonClass}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? activeButtonClass : buttonClass}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? activeButtonClass : buttonClass}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive('heading', { level: 4 }) ? activeButtonClass : buttonClass}
        >
          H4
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editor.isActive('heading', { level: 5 }) ? activeButtonClass : buttonClass}
        >
          H5
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editor.isActive('heading', { level: 6 }) ? activeButtonClass : buttonClass}
        >
          H6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? activeButtonClass : buttonClass}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? activeButtonClass : buttonClass}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? activeButtonClass : buttonClass}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={buttonClass}
        >
          Horizontal rule
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={buttonClass + (editor.can().chain().focus().undo().run() ? '' : ' opacity-50 cursor-not-allowed')}
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={buttonClass + (editor.can().chain().focus().redo().run() ? '' : ' opacity-50 cursor-not-allowed')}
        >
          Redo
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#958DF1').run()}
          className={editor.isActive('textStyle', { color: '#958DF1' }) ? activeButtonClass : buttonClass}
        >
          Purple
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5 mb-2 mt-1">
        {/* Text alignment buttons */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? activeButtonClass : buttonClass}
        >
          Align left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? activeButtonClass : buttonClass}
        >
          Align center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? activeButtonClass : buttonClass}
        >
          Align right
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={editor.isActive({ textAlign: 'justify' }) ? activeButtonClass : buttonClass}
        >
          Justify
        </button>
      </div>
    </div>
  )
}

const extensions = [
  Color,
  TextStyle,
  Alignment.configure({
    types: ['heading', 'paragraph'],
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
]



// Add some global Tailwind styling for the editor content
const EditorContent = () => {
  return (
    <div className="prose max-w-none p-4">
      {/* TipTap will inject content here */}
    </div>
  )
}

export default ({ roomId }: { roomId: string }) => {
  const [editorContent, setEditorContent] = useState<string | null>(null); 
  const { user } = useAuth()
 
  useEffect(() => {
    async function fetchContent() {
      const content = await noteServices.getInitialContent(roomId)
      setEditorContent(content)
    }
    fetchContent()
  }, [])

  const handleUpdate = ({ editor }: { editor: any }) => {

    const html = editor.getHTML()
    setEditorContent(html)

    noteServices.writeNote(roomId, user?.id as string, html)
  };

  if (editorContent === null) return <div>Loading editor...</div>

  return (
    <>
      <div className="border border-gray-300 rounded-md h-full w-full overflow-y-auto ">
        
         <EditorProvider
         
         slotBefore={<MenuBar />}
         extensions={extensions}
         content={editorContent}
         onUpdate={handleUpdate}
         editorProps={{
           attributes: {
             class: `${styles.proseMirror} prose max-w-none p-4 focus:outline-none`, // Apply the scoped class
           },
         }}
       /> 
       
      </div>
    </>


  )
}