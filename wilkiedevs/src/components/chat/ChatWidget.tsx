'use client'

import { useState, useEffect, useRef } from 'react'
import { workflowManager } from '@/lib/n8n-workflows'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  actions?: ChatAction[]
  isAnimating?: boolean
}

interface ChatAction {
  type: 'quote' | 'contact' | 'service' | 'phone' | 'lead-form' | 'schedule'
  label: string
  data?: any
}

interface ChatSession {
  sessionId: string
  userEmail?: string
  userName?: string
  leadCaptured: boolean
  intent?: string
  context: Record<string, any>
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
  const [session, setSession] = useState<ChatSession>({
    sessionId: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    leadCaptured: false,
    context: {}
  })
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Auto-focus en el input cuando se abre el chat
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  const addMessage = (content: string, type: 'user' | 'bot', actions?: ChatAction[], delay: number = 0) => {
    const addMessageWithAnimation = () => {
      const newMessage: Message = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        content,
        timestamp: new Date(),
        actions,
        isAnimating: true
      }
      
      setMessages(prev => [...prev, newMessage])
      
      // Remover animación después de un momento
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, isAnimating: false }
              : msg
          )
        )
      }, 500)
    }

    if (delay > 0) {
      setTimeout(addMessageWithAnimation, delay)
    } else {
      addMessageWithAnimation()
    }
  }

  // Función para detectar intención del usuario
  const detectIntent = (message: string): string => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cotiz') || lowerMessage.includes('cuanto')) {
      return 'pricing'
    } else if (lowerMessage.includes('servicio') || lowerMessage.includes('desarrollo') || lowerMessage.includes('web') || lowerMessage.includes('app')) {
      return 'services'
    } else if (lowerMessage.includes('contacto') || lowerMessage.includes('hablar') || lowerMessage.includes('llamar') || lowerMessage.includes('reunión')) {
      return 'contact'
    } else if (lowerMessage.includes('hola') || lowerMessage.includes('hi') || lowerMessage.includes('buenos') || lowerMessage.includes('buenas')) {
      return 'greeting'
    } else if (lowerMessage.includes('automatiz') || lowerMessage.includes('ia') || lowerMessage.includes('inteligencia')) {
      return 'automation'
    } else if (lowerMessage.includes('tiempo') || lowerMessage.includes('cuando') || lowerMessage.includes('plazo')) {
      return 'timeline'
    } else {
      return 'general'
    }
  }

  // Función para capturar lead durante la conversación
  const captureLead = async (leadData: { name?: string; email?: string; phone?: string; intent?: string }) => {
    if (session.leadCaptured) return

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadData.name || 'Usuario del Chat',
          email: leadData.email || `${session.sessionId}@temp.wilkiedevs.com`,
          phone: leadData.phone,
          service_interest: leadData.intent || session.intent || 'Consulta general',
          source: 'chatbot',
          message: `Conversación iniciada desde chatbot. Intent: ${leadData.intent || session.intent}`
        })
      })

      if (response.ok) {
        setSession(prev => ({ 
          ...prev, 
          leadCaptured: true,
          userEmail: leadData.email,
          userName: leadData.name
        }))

        // Disparar workflow de chatbot
        await workflowManager.triggerChatbotInteraction({
          sessionId: session.sessionId,
          userMessage: 'Lead captured',
          botResponse: 'Lead information collected',
          intent: leadData.intent || session.intent,
          leadCaptured: true,
          userEmail: leadData.email
        })
      }
    } catch (error) {
      console.error('Error capturando lead:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    setInputValue('')
    addMessage(userMessage, 'user')

    // Detectar intención y actualizar contexto
    const intent = detectIntent(userMessage)
    setSession(prev => ({ ...prev, intent, context: { ...prev.context, lastMessage: userMessage } }))

    // Disparar workflow de interacción
    try {
      await workflowManager.triggerChatbotInteraction({
        sessionId: session.sessionId,
        userMessage,
        botResponse: 'Processing...',
        intent,
        leadCaptured: session.leadCaptured,
        userEmail: session.userEmail
      })
    } catch (error) {
      console.error('Error enviando interacción a N8N:', error)
    }

    // Simular typing con tiempo variable según la complejidad
    setIsTyping(true)
    const typingDelay = userMessage.length > 50 ? 2000 : userMessage.length > 20 ? 1500 : 1000
    
    setTimeout(() => {
      setIsTyping(false)
      handleBotResponse(userMessage, intent)
    }, typingDelay)
  }

  const handleBotResponse = (userMessage: string, intent: string) => {
    switch (intent) {
      case 'pricing':
        addMessage(
          '💰 ¡Perfecto! Te ayudo con una cotización personalizada. Nuestros precios varían según la complejidad del proyecto.',
          'bot'
        )
        addMessage(
          '¿Qué tipo de proyecto tienes en mente?',
          'bot',
          [
            { type: 'quote', label: '🌐 Sitio Web Corporativo ($2,000 - $5,000)', data: 'corporate' },
            { type: 'quote', label: '🛒 Tienda Online ($3,000 - $8,000)', data: 'ecommerce' },
            { type: 'quote', label: '📱 App Móvil ($5,000 - $15,000)', data: 'mobile' },
            { type: 'quote', label: '🤖 Automatización ($1,500 - $10,000)', data: 'automation' }
          ],
          800
        )
        break

      case 'services':
        addMessage(
          '🚀 ¡Excelente! Somos especialistas en transformación digital. Aquí tienes nuestros servicios principales:',
          'bot'
        )
        addMessage(
          '¿Cuál te interesa más?',
          'bot',
          [
            { type: 'service', label: '💻 Desarrollo Web & Apps', data: 'web-development' },
            { type: 'service', label: '🤖 Automatización con IA', data: 'automation' },
            { type: 'service', label: '📱 Apps Móviles Nativas', data: 'mobile-apps' },
            { type: 'service', label: '🎥 Producción Audiovisual', data: 'audiovisual' },
            { type: 'service', label: '🎯 Marketing Digital', data: 'marketing' }
          ],
          600
        )
        break

      case 'contact':
        if (!session.leadCaptured) {
          addMessage(
            '👋 ¡Me encanta que quieras conectar con nosotros! Para brindarte la mejor atención, me gustaría conocerte un poco.',
            'bot'
          )
          addMessage(
            '¿Podrías compartir tu nombre y email? Así nuestro equipo podrá contactarte de manera personalizada.',
            'bot',
            [
              { type: 'lead-form', label: '📝 Compartir mis datos' },
              { type: 'phone', label: '📞 Prefiero que me llamen: +57 310 665 46 41' }
            ],
            800
          )
        } else {
          addMessage(
            `¡Perfecto ${session.userName || 'amigo'}! Ya tengo tus datos. Te contactaremos pronto.`,
            'bot',
            [
              { type: 'schedule', label: '📅 Agendar reunión' },
              { type: 'phone', label: '📞 Llamar ahora: +57 310 665 46 41' }
            ]
          )
        }
        break

      case 'greeting':
        const greetings = [
          '¡Hola! 👋 Es un placer conocerte. Soy Rebecca, tu asesora digital en WilkieDevs.',
          '¡Qué bueno verte por aquí! 😊 Estoy aquí para ayudarte con cualquier proyecto digital.',
          '¡Hola! 🌟 Bienvenido a WilkieDevs. ¿En qué aventura digital puedo acompañarte hoy?'
        ]
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]
        
        addMessage(randomGreeting, 'bot')
        addMessage(
          '¿Qué te trae por aquí hoy?',
          'bot',
          [
            { type: 'service', label: '🔍 Explorar servicios' },
            { type: 'quote', label: '💰 Solicitar cotización' },
            { type: 'contact', label: '👨‍💼 Hablar con el equipo' },
            { type: 'service', label: '🤖 Conocer sobre automatización' }
          ],
          1000
        )
        break

      case 'automation':
        addMessage(
          '🤖 ¡Excelente elección! La automatización con IA es nuestro fuerte. Podemos ayudarte a:',
          'bot'
        )
        addMessage(
          '• Automatizar procesos repetitivos\n• Integrar sistemas con N8N\n• Crear chatbots inteligentes\n• Optimizar workflows empresariales',
          'bot'
        )
        addMessage(
          '¿Te interesa alguna automatización específica?',
          'bot',
          [
            { type: 'quote', label: '🔄 Automatización de procesos' },
            { type: 'quote', label: '🤖 Chatbot personalizado' },
            { type: 'quote', label: '📊 Integración de sistemas' },
            { type: 'contact', label: '💬 Hablar con especialista' }
          ],
          1200
        )
        break

      case 'timeline':
        addMessage(
          '⏰ Los tiempos de desarrollo dependen del proyecto, pero aquí tienes una guía general:',
          'bot'
        )
        addMessage(
          '• Landing Page: 1-2 semanas\n• Sitio Corporativo: 3-4 semanas\n• E-commerce: 4-6 semanas\n• App Móvil: 8-12 semanas\n• Automatización: 2-4 semanas',
          'bot'
        )
        addMessage(
          '¿Tienes algún deadline específico?',
          'bot',
          [
            { type: 'quote', label: '🚀 Proyecto urgente (rush)' },
            { type: 'quote', label: '📅 Timeline normal' },
            { type: 'contact', label: '💬 Discutir fechas' }
          ],
          800
        )
        break

      default:
        const responses = [
          'Entiendo tu consulta. Déjame conectarte con la información que necesitas.',
          'Interesante pregunta. Te ayudo a encontrar la mejor solución.',
          'Perfecto, vamos a resolver eso juntos.'
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        
        addMessage(randomResponse, 'bot')
        addMessage(
          '¿Te gustaría que te ayude con algo específico?',
          'bot',
          [
            { type: 'service', label: '💻 Ver servicios' },
            { type: 'quote', label: '💰 Solicitar cotización' },
            { type: 'contact', label: '👨‍💼 Hablar con especialista' },
            { type: 'lead-form', label: '📝 Dejar mis datos' }
          ],
          600
        )
        break
    }
  }

  const handleActionClick = (action: ChatAction) => {
    switch (action.type) {
      case 'quote':
        addMessage(`Me interesa: ${action.label}`, 'user')
        
        if (!session.leadCaptured) {
          addMessage(
            '¡Excelente elección! 🎯 Para preparar tu cotización personalizada, necesito conocerte un poco mejor.',
            'bot',
            [],
            800
          )
          addMessage(
            '¿Podrías compartir tu nombre y email? Así podremos enviarte la cotización detallada.',
            'bot',
            [
              { type: 'lead-form', label: '📝 Compartir mis datos' },
              { type: 'phone', label: '📞 Prefiero que me llamen' }
            ],
            1200
          )
        } else {
          addMessage(
            `Perfecto ${session.userName}! Te prepararé una cotización para ${action.data}. Te llegará a ${session.userEmail} en las próximas horas.`,
            'bot',
            [
              { type: 'schedule', label: '📅 Agendar reunión' },
              { type: 'service', label: '🔍 Ver otros servicios' }
            ],
            800
          )
        }
        break
      
      case 'service':
        addMessage(`Quiero saber sobre: ${action.label}`, 'user')
        
        const serviceInfo = {
          'web-development': 'Desarrollamos sitios web modernos, responsivos y optimizados para SEO. Desde landing pages hasta plataformas complejas.',
          'automation': 'Automatizamos procesos empresariales con IA y herramientas como N8N. Ahorra tiempo y reduce errores.',
          'mobile-apps': 'Creamos apps nativas para iOS y Android con las últimas tecnologías y mejor UX.',
          'audiovisual': 'Producción de videos corporativos, tours virtuales 360° y contenido multimedia profesional.',
          'marketing': 'Estrategias digitales completas: SEO, SEM, redes sociales y automatización de marketing.'
        }
        
        const info = serviceInfo[action.data as keyof typeof serviceInfo] || 'Este servicio es una de nuestras especialidades.'
        
        addMessage(info, 'bot', [], 1000)
        addMessage(
          '¿Te gustaría una cotización personalizada o prefieres hablar directamente con nuestro especialista?',
          'bot',
          [
            { type: 'quote', label: '💰 Solicitar cotización', data: action.data },
            { type: 'contact', label: '👨‍💼 Hablar con especialista' },
            { type: 'service', label: '📋 Ver más servicios' }
          ],
          1500
        )
        break
      
      case 'contact':
        addMessage(action.label, 'user')
        
        if (!session.leadCaptured) {
          addMessage(
            '¡Perfecto! 👥 Nuestro equipo estará encantado de atenderte. Para conectarte con la persona indicada, comparte tus datos.',
            'bot',
            [
              { type: 'lead-form', label: '📝 Compartir mis datos' },
              { type: 'phone', label: '📞 Llamar directamente: +57 310 665 46 41' }
            ],
            800
          )
        } else {
          addMessage(
            `¡Listo ${session.userName}! Te contactaremos a ${session.userEmail} o al teléfono que proporcionaste.`,
            'bot',
            [
              { type: 'phone', label: '📞 +57 310 665 46 41' },
              { type: 'schedule', label: '📅 Agendar reunión' }
            ],
            800
          )
        }
        break
      
      case 'phone':
        addMessage('Prefiero contacto telefónico', 'user')
        addMessage(
          '📞 ¡Excelente! Puedes llamarnos directamente al +57 310 665 46 41 o nosotros te llamamos.',
          'bot'
        )
        
        if (!session.leadCaptured) {
          addMessage(
            'Si prefieres que te llamemos, comparte tu número y el mejor horario para contactarte.',
            'bot',
            [
              { type: 'lead-form', label: '📝 Dejar mi número' },
              { type: 'phone', label: '📞 Llamar ahora: +57 310 665 46 41' }
            ],
            1000
          )
        }
        break

      case 'lead-form':
        addMessage('Quiero compartir mis datos', 'user')
        setShowLeadForm(true)
        break

      case 'schedule':
        addMessage('Me gustaría agendar una reunión', 'user')
        addMessage(
          '📅 ¡Perfecto! Te enviaremos un link de Calendly para que elijas el horario que mejor te convenga.',
          'bot',
          [
            { type: 'contact', label: '📧 Enviar link por email' },
            { type: 'phone', label: '📞 Coordinar por teléfono' }
          ],
          800
        )
        break
    }
  }

  // Manejar envío del formulario de lead
  const handleLeadFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!leadFormData.name || !leadFormData.email) {
      return
    }

    // Capturar lead
    await captureLead({
      name: leadFormData.name,
      email: leadFormData.email,
      phone: leadFormData.phone,
      intent: session.intent
    })

    setShowLeadForm(false)
    setLeadFormData({ name: '', email: '', phone: '' })

    addMessage(
      `¡Gracias ${leadFormData.name}! 🎉 Ya tengo tus datos. Nuestro equipo se pondrá en contacto contigo pronto.`,
      'bot'
    )
    
    addMessage(
      '¿Hay algo más en lo que pueda ayudarte mientras tanto?',
      'bot',
      [
        { type: 'quote', label: '💰 Solicitar cotización' },
        { type: 'service', label: '🔍 Explorar servicios' },
        { type: 'schedule', label: '📅 Agendar reunión' }
      ],
      1500
    )
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
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} ${
                  message.isAnimating ? 'animate-fade-in-up' : ''
                }`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.type === 'bot' && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">R</span>
                      </div>
                      <span className="text-xs text-gray-500">Rebecca</span>
                    </div>
                  )}
                  
                  <div
                    className={`
                      px-4 py-3 rounded-2xl text-sm leading-relaxed
                      ${message.type === 'user'
                        ? 'bg-primary text-white rounded-br-md shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md shadow-sm'
                      }
                    `}
                  >
                    {message.content.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                  
                  {/* Actions */}
                  {message.actions && (
                    <div className="mt-3 space-y-2">
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleActionClick(action)}
                          className="block w-full text-left px-4 py-3 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 mt-2 px-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Lead Form */}
            {showLeadForm && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg animate-fade-in-up">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  📝 Comparte tus datos
                </h4>
                <form onSubmit={handleLeadFormSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={leadFormData.name}
                    onChange={(e) => setLeadFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                    required
                  />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={leadFormData.email}
                    onChange={(e) => setLeadFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono (opcional)"
                    value={leadFormData.phone}
                    onChange={(e) => setLeadFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Enviar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLeadForm(false)}
                      className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">R</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  maxLength={500}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm resize-none"
                  disabled={isTyping}
                />
                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                  {inputValue.length}/500
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="w-12 h-12 bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-2xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              >
                {isTyping ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => handleActionClick({ type: 'service', label: '🔍 Ver servicios', data: 'services' })}
                  className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  🔍 Ver servicios
                </button>
                <button
                  onClick={() => handleActionClick({ type: 'quote', label: '💰 Cotización', data: 'quote' })}
                  className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  💰 Cotización
                </button>
              </div>
            )}
          </div>

          {/* CSS Animations */}
          <style jsx>{`
            @keyframes fade-in-up {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes fade-in {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            
            .animate-fade-in-up {
              animation: fade-in-up 0.3s ease-out;
            }
            
            .animate-fade-in {
              animation: fade-in 0.2s ease-out;
            }
          `}</style>
        </div>
      )}
    </>
  )
}