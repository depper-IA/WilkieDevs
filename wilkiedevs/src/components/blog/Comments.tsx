'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getTimeAgo } from '@/utils/dates'
import type { Comment } from '@/types/blog'

interface CommentsProps {
  postId: string
  initialComments: Comment[]
}

export default function Comments({ postId, initialComments }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    // TODO: Implementar lógica de envío al backend
    // Simulación de envío
    const comment: Comment = {
      id: Date.now().toString(),
      postId,
      author: {
        name: 'Usuario Anónimo', // TODO: Integrar sistema de autenticación
        email: 'anonymous@example.com',
        avatar: '/images/default-avatar.png',
      },
      content: newComment,
      createdAt: new Date().toISOString(),
      replies: [],
    }

    if (replyTo) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === replyTo
            ? { ...c, replies: [...(c.replies || []), comment] }
            : c
        )
      )
      setReplyTo(null)
    } else {
      setComments((prev) => [comment, ...prev])
    }

    setNewComment('')
    setIsSubmitting(false)
  }

  const CommentForm = ({ onSubmit }: { onSubmit: (e: React.FormEvent) => void }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe tu comentario..."
          rows={3}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-secondary dark:text-text-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent resize-none"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Los comentarios son moderados antes de ser publicados
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando...' : 'Comentar'}
        </button>
      </div>
    </form>
  )

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-secondary dark:text-text-light">
        Comentarios ({comments.length})
      </h3>

      <CommentForm onSubmit={handleSubmit} />

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            {/* Comentario principal */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
              <div className="flex items-start gap-4">
                <Image
                  src={comment.author.avatar || '/images/default-avatar.png'}
                  alt={comment.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-secondary dark:text-text-light">
                        {comment.author.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getTimeAgo(comment.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="text-primary dark:text-accent hover:opacity-80"
                    >
                      Responder
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
                </div>
              </div>
            </div>

            {/* Formulario de respuesta */}
            {replyTo === comment.id && (
              <div className="ml-12">
                <CommentForm onSubmit={handleSubmit} />
              </div>
            )}

            {/* Respuestas */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-12 space-y-4">
                {comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-start gap-4">
                      <Image
                        src={reply.author.avatar || '/images/default-avatar.png'}
                        alt={reply.author.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <div className="mb-2">
                          <h4 className="font-medium text-secondary dark:text-text-light">
                            {reply.author.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {getTimeAgo(reply.createdAt)}
                          </p>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}