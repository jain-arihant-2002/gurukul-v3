'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import RichTextEditor from './RichTextEditor'

interface ContentFormProps {
  onSubmit?: (data: { title: string; content: string }) => void
  initialTitle?: string
  initialContent?: string
  submitLabel?: string
}

export default function ContentForm({
  onSubmit,
  initialTitle = '',
  initialContent = '',
  submitLabel = 'Save Content'
}: ContentFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content')
      return
    }

    setIsSubmitting(true)
    
    try {
      await onSubmit?.({ title: title.trim(), content })
      // Reset form if needed
      // setTitle('')
      // setContent('')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to save content. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Write your content here..."
          className="min-h-[300px]"
        />
      </div>

      <div className="flex gap-2">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
        
        <Button 
          type="button" 
          variant="outline"
          onClick={() => {
            setTitle('')
            setContent('')
          }}
        >
          Clear All
        </Button>
      </div>
    </form>
  )
}
