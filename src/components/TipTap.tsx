'use client'

import { authors } from '@/data/authors'
import type { Message, Post } from '@/types'
import Bold from '@tiptap/extension-bold'
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Youtube from '@tiptap/extension-youtube'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import NextImage from 'next/image'
import { useState } from 'react'
import TipTapToolbar from './TipTapToolbar'

type Props = {
  post?: Post
}

// TODO Add upload button to upload images to Cloudinary. If the cover image comes from Cloudinary, save `cover_image_cloudinary` in the database (a new column, remember to update the database schema)
// TODO Go to @/components/CloudinaryImage and add a prop to conditionally render the Cloudinary image or the Next.js image based on if `cover_image_cloudinary` is present or not

export default function Component({ post }: Props) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<Message>({
    type: 'success',
    text: '',
  })
  const [isFocused, setIsFocused] = useState(false)
  const [title, setTitle] = useState(post?.title || '')
  const [description, setDescription] = useState(post?.description || '')
  const [coverImage, setCoverImage] = useState(post?.cover_image || '')
  const [author, setAuthor] = useState(post?.author || authors[0].name || '')

  // TODO: Fix TipTap warning: Duplicate extension names found: ['bold', 'italic', 'heading']

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Image,
      Link,
      Heading.configure({
        levels: [2, 3],
      }),
      Placeholder.configure({
        placeholder: 'Scrivi qualcosa...',
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
        modestBranding: true,
        width: 320,
        height: 180,
      }),
    ],
    onFocus: () => setIsFocused(true),
    onBlur: ({ editor }) => {
      if (editor.isEmpty) setIsFocused(false)
    },
    content: post?.content || '',
    editorProps: {
      attributes: {
        class: 'min-h-40 border border-gray-300 p-2 rounded-md',
      },
    },
    immediatelyRender: false,
  })

  const handleAddCoverImage = () => {
    const url = prompt("Inserisci l'URL dell'immagine:")
    // Check if the user entered a URL and the URL is valid
    if (url) {
      if (/^https?:\/\/\S+\.\S+/.test(url)) {
        setCoverImage(url)
      } else {
        alert('Per favore inserisci un URL di immagine valido')
      }
    }
  }

  const handlePublish = async () => {
    // Validate title: check if the title is empty
    if (!title) {
      setMessage({
        type: 'error',
        text: 'Per favore inserisci un titolo',
      })
      return
    }

    // Validate title: remove leading and trailing spaces
    setTitle(title.trim())

    // Validate title: accept only alphanumeric characters, spaces, and dashes
    if (!/^[a-zA-Z0-9\s-]+$/.test(title)) {
      setMessage({
        type: 'error',
        text: 'Il titolo può contenere solo lettere, numeri, spazi e trattini',
      })
      return
    }

    // Validate title: limit the title to 100 characters
    if (title.length > 100) {
      setMessage({
        type: 'error',
        text: 'Il titolo deve essere inferiore a 100 caratteri',
      })
      return
    }

    // Validate description: check if the description is empty
    if (!description) {
      setMessage({
        type: 'error',
        text: 'Per favore inserisci una descrizione',
      })
      return
    }

    // Validate description: remove leading and trailing spaces
    setDescription(description.trim())

    // Validate description: limit the description to 130 characters
    if (description.length > 130) {
      setMessage({
        type: 'error',
        text: 'La descrizione deve essere inferiore a 130 caratteri',
      })
      return
    }

    // Validate description: accept only alphanumeric characters, spaces, and dashes
    if (!/^[a-zA-Z0-9\s-]+$/.test(description)) {
      setMessage({
        type: 'error',
        text: 'La descrizione può contenere solo lettere, numeri, spazi e trattini',
      })
      return
    }

    // Validate image: check if the image is empty
    if (!coverImage) {
      setMessage({
        type: 'error',
        text: "Per favore inserisci un'immagine di copertina",
      })
      return
    }

    // Validate image: check if the image is a valid URL
    if (!/^https?:\/\/\S+\.\S+/.test(coverImage)) {
      setMessage({
        type: 'error',
        text: 'Per favore inserisci un URL di immagine valido',
      })
      return
    }

    if (!editor) return
    const htmlContent = editor.getHTML()

    // Validate content: check if the editor is empty
    if (!htmlContent.length || htmlContent === '<p></p>') {
      setMessage({
        type: 'error',
        text: 'Per favore inserisci del contenuto',
      })
      return
    }

    // Validate author: check if the author is empty
    if (!author) {
      setMessage({
        type: 'error',
        text: 'Per favore seleziona un autore',
      })
      return
    }

    // Validate author: check if the author is valid
    if (!authors.find((a) => a.name === author)) {
      setMessage({
        type: 'error',
        text: 'Per favore seleziona un autore valido',
      })
      return
    }

    // Validate author: remove leading and trailing spaces
    setAuthor(author.trim())

    // Start the loading state
    setLoading(true)
    setMessage({
      type: 'success',
      text: '',
    })

    try {
      // If post is passed as prop, it means we are editing an existing post
      const method = post ? 'PUT' : 'POST'

      const response = await fetch('/api/post', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          coverImage,
          content: htmlContent,
          author,

          // If post is passed as prop, also send the post id
          ...(post && { id: post.id }),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }

      // * Success
      setMessage({
        type: 'success',
        text: post
          ? 'Post aggiornato con successo!'
          : 'Post pubblicato con successo!',
      })

      // Clear content only if it's a new post
      if (!post) {
        editor.commands.clearContent() // clear the editor content
        setTitle('') // clear the title
        setDescription('') // clear the description
        setCoverImage('') // clear the cover image
        setAuthor(authors[0].name) // set the author to the first author
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage({
          type: 'error',
          text: `Error: ${error.message}`,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative max-w-3xl'>
      {/* Title */}
      <input
        type='text'
        placeholder='Titolo...'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='mb-4 w-full'
        maxLength={100}
      />

      {/* Description */}
      <input
        type='text'
        placeholder='Descrizione...'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className='mb-4 w-full'
        maxLength={130}
      />

      {/* Add cover image */}
      <button
        onClick={handleAddCoverImage}
        className='relative mb-4 flex aspect-video w-full'
      >
        {coverImage ? (
          <>
            {/* TODO: Decide if it is better to use my CloudinaryImage component here or add a new CldImage  */}
            <NextImage
              src={coverImage}
              fill={true}
              alt='Immagine di copertina'
              className='rounded-md'
              style={{ objectFit: 'cover' }}
            />
            <div className='absolute inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-50 font-semibold text-white opacity-0 hover:opacity-100'>
              Cambia immagine di copertina
            </div>
          </>
        ) : (
          <div className='flex h-full w-full select-none flex-wrap items-center justify-center rounded-md border border-gray-300 bg-gray-100 text-sm font-semibold dark:bg-neutral-900'>
            Aggiungi immagine di copertina
          </div>
        )}
      </button>

      {/* Editor toolbar */}
      <TipTapToolbar editor={editor} />

      {/* Editor */}
      <EditorContent
        editor={editor}
        className={`tiptap-editor mb-4 ${isFocused ? 'focused' : ''}`}
      />

      {/* Author */}
      <div className='mb-4 flex flex-col gap-2'>
        <label htmlFor='author' className='font-medium'>
          Autore
        </label>
        <select
          id='author'
          className='max-w-[151px]'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        >
          {authors.map((author) => (
            <option key={author.id} value={author.name}>
              {author.name}
            </option>
          ))}
        </select>
      </div>

      {/* Publish button */}
      <button
        onClick={handlePublish}
        className={`min-w-[138px] rounded bg-blue-600 px-4 py-2 text-white ${
          loading ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Pubblicazione...' : 'Pubblica'}
      </button>

      {/* Validation messages */}
      {message && (
        // TODO: Hide the message after a few seconds
        <p
          className={`mt-4 font-medium ${
            message.type === 'error'
              ? 'text-rose-600 dark:text-rose-500'
              : 'text-green-600 dark:text-green-500'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  )
}
