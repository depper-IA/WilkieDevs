'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  actions?: ChatAction[]
}

interface ChatAction {
  type: 'quote' | 'contact' | 'service' | 'phone'
  label: string
  data?: any
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'bot',
    content: '¡Hola! Soy Rebecca, tu asesora digital de WilkieDevs. ¿En qué puedo ayudarte hoy?',
    timestamp: new Date(),
    actions: [
      { type: 'service', label: '💻 Desarrollo Web', data: 'desarrollo-web' },
      { type: 'service', label: '🤖 Automatización', data: 'automatizacion' },
      { type: 'service', label: '📱 Apps Móviles', data: 'apps-moviles' },
      { type: 'quote', label: '💰 Solicitar Cotización' }
    ]
  }
]

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (content: string, type: 'user' | 'bot', actions?: ChatAction[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      actions
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setInputValue('')
    addMessage(userMessage, 'user')

    // Simular typing
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      handleBotResponse(userMessage)
    }, 1500)
  }

  const handleBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cotiz')) {
      addMessage(
        'Perfecto! Te ayudo con una cotización personalizada. ¿Qué tipo de proyecto necesitas?',
        'bot',
        [
          { type: 'quote', label: '🌐 Sitio Web Corporativo' },
          { type: 'quote', label: '🛒 Tienda Online' },
          { type: 'quote', label: '📱 App Móvil' },
          { type: 'quote', label: '🤖 Automatización' }
        ]
      )
    } else if (lowerMessage.includes('servicio') || lowerMessage.includes('desarrollo')) {
      addMessage(
        'Excelente! Ofrecemos varios servicios digitales. ¿Cuál te interesa más?',
        'bot',
        [
          { type: 'service', label: '💻 Desarrollo Web' },
          { type: 'service', label: '🤖 Automatización IA' },
          { type: 'service', label: '📱 Apps Móviles' },
          { type: 'service', label: '🎥 Producción Audiovisual' }
        ]
      )
    } else if (lowerMessage.includes('contacto') || lowerMessage.includes('hablar')) {
      addMessage(
        '¡Perfecto! Me encantaría conectarte con nuestro equipo. ¿Prefieres que te llamemos o te enviemos un WhatsApp?',
        'bot',
        [
          { type: 'phone', label: '📞 Llamada telefónica' },
          { type: 'contact', label: '💬 WhatsApp' },
          { type: 'contact', label: '📧 Email' }
        ]
      )
    } else if (lowerMessage.includes('hola') || lowerMessage.includes('hi')) {
      addMessage(
        '¡Hola! Es un placer conocerte. Soy Rebecca y estoy aquí para ayudarte con cualquier proyecto digital que tengas en mente. ¿Qué te trae por aquí hoy?',
        'bot',
        [
          { type: 'service', label: '🔍 Explorar servicios' },
          { type: 'quote', label: '💰 Solicitar cotización' },
          { type: 'contact', label: '👋 Solo saludar' }
        ]
      )
    } else {
      addMessage(
        'Entiendo tu consulta. Te conectaré con uno de nuestros especialistas para darte la mejor respuesta. Mientras tanto, ¿te gustaría conocer nuestros servicios?',
        'bot',
        [
          { type: 'service', label: '💻 Ver servicios' },
          { type: 'quote', label: '💰 Solicitar cotización' },
          { type: 'contact', label: '👨‍💼 Hablar con especialista' }
        ]
      )
    }
  }

  const handleActionClick = (action: ChatAction) => {
    switch (action.type) {
      case 'quote':
        addMessage(`Me interesa: ${action.label}`, 'user')
        setTimeout(() => {
          addMessage(
            '¡Excelente elección! Para preparar tu cotización personalizada, necesito algunos datos. ¿Podrías compartir tu nombre y email?',
            'bot',
            [
              { type: 'contact', label: '📝 Completar formulario' },
              { type: 'phone', label: '📞 Prefiero que me llamen' }
            ]
          )
        }, 1000)
        break
      
      case 'service':
        addMessage(`Quiero saber sobre: ${action.label}`, 'user')
        setTimeout(() => {
          addMessage(
            `${action.label} es una de nuestras especialidades! Te puedo contar más detalles o conectarte directamente con nuestro equipo especializado.`,
            'bot',
            [
              { type: 'quote', label: '💰 Solicitar cotización' },
              { type: 'contact', label: '👨‍💼 Hablar con especialista' },
              { type: 'service', label: '📋 Ver más servicios' }
            ]
          )
        }, 1000)
        break
      
      case 'contact':
        addMessage(action.label, 'user')
        setTimeout(() => {
          addMessage(
            '¡Perfecto! Te voy a conectar con nuestro equipo. Puedes escribirnos al +57 310 665 46 41 o enviarnos un email a info@wilkie-design.com',
            'bot',
            [
              { type: 'phone', label: '📞 +57 310 665 46 41' },
              { type: 'contact', label: '📧 info@wilkie-design.com' }
            ]
          )
        }, 1000)
        break
      
      case 'phone':
        addMessage('Prefiero contacto telefónico', 'user')
        setTimeout(() => {
          addMessage(
            '¡Excelente! Nuestro equipo te contactará en las próximas horas. Número: +57 310 665 46 41. ¿Hay algún horario que prefieras?',
            'bot'
          )
        }, 1000)
        break
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Widget Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-primary hover:bg-primary/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          {isOpen ? (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="relative">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {/* Indicador de disponibilidad */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </button>
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            ¡Hola! Soy Rebecca, ¿necesitas ayuda?
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800" />
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Rebecca</h3>
              <p className="text-sm text-white/80">Asesora Digital • En línea</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`
                      px-4 py-2 rounded-2xl text-sm
                      ${message.type === 'user'
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md'
                      }
                    `}
                  >
                    {message.content}
                  </div>
                  
                  {/* Actions */}
                  {message.actions && (
                    <div className="mt-2 space-y-1">
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleActionClick(action)}
                          className="block w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="w-10 h-10 bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}