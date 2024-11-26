'use client'

import Bold from '@tiptap/extension-bold'
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'
import Italic from '@tiptap/extension-italic'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import { TipTapToolbar } from './TipTapToolbar'

export default function TipTap() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [isFocused, setIsFocused] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Image,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Placeholder.configure({
        placeholder: 'Write something...',
      }),
    ],
    onFocus: () => setIsFocused(true),
    onBlur: ({ editor }) => {
      if (editor.isEmpty) setIsFocused(false)
    },
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-40 border border-gray-300 p-2 rounded-md',
      },
    },
    immediatelyRender: false,
  })

  const handlePublish = async () => {
    if (!newPostTitle) {
      setMessageType('error')
      setMessage('Please enter a title')
      return
    }

    if (!editor) return
    const htmlContent = editor.getHTML()

    if (!htmlContent.length || htmlContent === '<p></p>') {
      setMessageType('error')
      setMessage('Please enter some content')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/publish-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newPostTitle,
          content: htmlContent,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to publish post')
      }

      setMessageType('success')
      setMessage('Post published successfully!')
      editor.commands.clearContent()
    } catch (error) {
      if (error instanceof Error) {
        setMessageType('error')
        setMessage(`Error: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-3xl'>
      <input
        type='text'
        placeholder='Title...'
        value={newPostTitle}
        onChange={(e) => setNewPostTitle(e.target.value)}
        className='mb-4 w-full'
      />
      <TipTapToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className={`tiptap-editor ${isFocused ? 'focused' : ''}`}
      />
      <button
        onClick={handlePublish}
        className={`mt-4 rounded bg-blue-600 px-4 py-2 text-white ${
          loading ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Publishing...' : 'Publish'}
      </button>
      {message && (
        <p
          className={`mt-4 font-medium ${
            messageType === 'success'
              ? 'text-green-600 dark:text-green-500'
              : 'text-rose-600 dark:text-rose-500'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}