'use client'

import { useRef, useEffect, useState } from 'react'
import Vapi from '@vapi-ai/web'

interface ChatbotContainerProps {
  onChatStateChange: (state: 'idle' | 'user-speaking' | 'bot-speaking') => void
  onChatActiveChange: (active: boolean) => void
}

export default function ChatbotContainer({ 
  onChatStateChange, 
  onChatActiveChange 
}: ChatbotContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const transcriptsContainerRef = useRef<HTMLDivElement>(null)
  const vapiRef = useRef<Vapi | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastRoleRef = useRef<string | null>(null) // Rastrear el último role conocido
  
  // Usar refs para las callbacks para evitar re-registros de listeners
  const onChatStateChangeRef = useRef(onChatStateChange)
  const onChatActiveChangeRef = useRef(onChatActiveChange)
  
  // Actualizar refs cuando cambian las callbacks
  useEffect(() => {
    onChatStateChangeRef.current = onChatStateChange
    onChatActiveChangeRef.current = onChatActiveChange
  }, [onChatStateChange, onChatActiveChange])
  
  const [isCallActive, setIsCallActive] = useState(false)
  const [chatMode, setChatMode] = useState<'voice' | 'text' | null>(null) // Modo de chat seleccionado
  const [transcripts, setTranscripts] = useState<Array<{ role: string; text: string; timestamp: number }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [textInput, setTextInput] = useState('') // Input de texto para modo chat
  const [previousChatId, setPreviousChatId] = useState<string | undefined>(undefined) // Para mantener contexto en modo chat

  // Obtener la API key de VAPI desde variables de entorno
  const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || ''

  // Scroll automático al final cuando hay nuevos transcripts
  useEffect(() => {
    if (transcriptsContainerRef.current && transcripts.length > 0) {
      transcriptsContainerRef.current.scrollTop = transcriptsContainerRef.current.scrollHeight
    }
  }, [transcripts])

  useEffect(() => {
    // Inicializar VAPI solo en el cliente
    if (typeof window !== 'undefined' && VAPI_PUBLIC_KEY) {
      vapiRef.current = new Vapi(VAPI_PUBLIC_KEY)

      // Configurar eventos de VAPI
      const vapi = vapiRef.current
      
      // Función helper para limpiar timeout
      const clearExistingTimeout = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
      }
      
      // Función helper para actualizar estado del chat
      const updateChatState = (newState: 'idle' | 'user-speaking' | 'bot-speaking') => {
        clearExistingTimeout()
        onChatStateChangeRef.current(newState)
      }

      const handleCallStart = () => {
        console.log('Llamada iniciada')
        setIsCallActive(true)
        setIsLoading(false)
        onChatActiveChangeRef.current(true)
        // Cuando inicia la llamada, establecer estado inicial
        // El bot suele hablar primero, así que asumimos que el primer speech será del bot
        lastRoleRef.current = 'assistant'
        updateChatState('idle')
      }

      const handleCallEnd = () => {
        console.log('Llamada finalizada - evento call-end recibido')
        clearExistingTimeout()
        setIsCallActive(false)
        onChatActiveChangeRef.current(false)
        updateChatState('idle')
        setTranscripts([])
        setIsLoading(false)
        lastRoleRef.current = null // Limpiar el último role
      }

      // El evento 'message' contiene las transcripciones y mensajes
      const handleMessage = (message: any) => {
        console.log('Mensaje recibido:', message)
        
        // Manejar diferentes estructuras de datos de VAPI
        const role = message.role || message.type || 'unknown'
        const text = message.transcript || message.text || message.content || message.message || ''
        
        if (!text) return // Ignorar si no hay texto
        
        // Guardar el último role conocido para usar con speech-start/speech-end
        if (role === 'user' || role === 'user-message' || role === 'assistant' || role === 'assistant-message') {
          lastRoleRef.current = role
        }
        
        const newTranscript = {
          role: role,
          text: text,
          timestamp: Date.now()
        }
        
        setTranscripts(prev => [...prev, newTranscript])
        
        // Actualizar estado del shader según quién está hablando
        if (role === 'user' || role === 'user-message') {
          console.log('Mensaje de usuario detectado - cambiando estado a user-speaking')
          updateChatState('user-speaking')
        } else if (role === 'assistant' || role === 'assistant-message' || role === 'function-call') {
          console.log('Mensaje de bot detectado - cambiando estado a bot-speaking')
          updateChatState('bot-speaking')
        }

        // NO programar timeout aquí - dejar que speech-end maneje el retorno a idle
        // Esto evita conflictos entre message y speech-end
      }

      // Eventos de detección de voz en tiempo real (más precisos que message)
      const handleSpeechStart = () => {
        console.log('Alguien comenzó a hablar - último role conocido:', lastRoleRef.current)
        
        // Usar el último role conocido para determinar quién está hablando
        // Si no hay role conocido, asumir que es el bot (típicamente habla primero)
        let detectedRole = lastRoleRef.current
        
        if (!detectedRole) {
          detectedRole = 'assistant'
          lastRoleRef.current = 'assistant'
        }
        
        // Actualizar estado según quién está hablando
        if (detectedRole === 'user' || detectedRole === 'user-message') {
          console.log('Usuario comenzó a hablar - cambiando estado a user-speaking')
          updateChatState('user-speaking')
        } else if (detectedRole === 'assistant' || detectedRole === 'assistant-message') {
          console.log('Bot comenzó a hablar - cambiando estado a bot-speaking')
          updateChatState('bot-speaking')
        } else {
          // Si no hay role conocido y no es user ni assistant, asumir bot
          console.log('Role desconocido, asumiendo bot - cambiando estado a bot-speaking')
          lastRoleRef.current = 'assistant'
          updateChatState('bot-speaking')
        }
      }

      const handleSpeechEnd = () => {
        console.log('Alguien terminó de hablar')
        
        // Limpiar timeout anterior
        clearExistingTimeout()
        
        // Pequeño delay antes de volver a idle (esperar a que llegue el siguiente speech-start o mensaje)
        timeoutRef.current = setTimeout(() => {
          updateChatState('idle')
        }, 1500)
      }

      const handleError = (error: Error) => {
        console.error('Error de VAPI:', error)
        setError(error.message)
        setIsLoading(false)
      }

      // Registrar todos los event listeners
      vapi.on('call-start', handleCallStart)
      vapi.on('call-end', handleCallEnd)
      vapi.on('message', handleMessage)
      vapi.on('speech-start', handleSpeechStart)
      vapi.on('speech-end', handleSpeechEnd)
      vapi.on('error', handleError)

      // Cleanup al desmontar o cuando cambian las dependencias
      return () => {
        console.log('Limpiando listeners de VAPI')
        clearExistingTimeout()
        
        // Remover todos los event listeners
        if (vapi) {
          vapi.off('call-start', handleCallStart)
          vapi.off('call-end', handleCallEnd)
          vapi.off('message', handleMessage)
          vapi.off('speech-start', handleSpeechStart)
          vapi.off('speech-end', handleSpeechEnd)
          vapi.off('error', handleError)
        }
        
        // Si la llamada está activa, intentar detenerla
        // Usar el valor actual de isCallActive desde el closure
        const wasCallActive = vapiRef.current !== null
        if (vapiRef.current && wasCallActive) {
          try {
            vapiRef.current.stop()
          } catch (err) {
            console.error('Error al detener VAPI en cleanup:', err)
          }
        }
      }
    } else if (!VAPI_PUBLIC_KEY) {
      setError('VAPI_PUBLIC_KEY no está configurada. Por favor configura NEXT_PUBLIC_VAPI_PUBLIC_KEY en tu archivo .env.local')
    }
  }, [VAPI_PUBLIC_KEY]) // Solo dependemos de VAPI_PUBLIC_KEY, no de las callbacks ni isCallActive

  const handleStartCall = async (mode: 'voice' | 'text') => {
    setIsLoading(true)
    setError(null)
    setTranscripts([])
    setChatMode(mode)
    setPreviousChatId(undefined) // Resetear contexto al iniciar nueva conversación

    try {
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID
      
      if (!assistantId) {
        setError('NEXT_PUBLIC_VAPI_ASSISTANT_ID no está configurado. Por favor configura un assistant ID en tu archivo .env.local. Puedes crear un asistente en https://vapi.ai/dashboard')
        setIsLoading(false)
        setChatMode(null)
        return
      }

      if (mode === 'voice') {
        // Modo voz: usar vapi.start() para iniciar llamada de voz
        if (!vapiRef.current) {
          setError('VAPI no está inicializado. Verifica tu API key.')
          setIsLoading(false)
          setChatMode(null)
          return
        }
        await vapiRef.current.start(assistantId)
      } else {
        // Modo texto: NO necesitamos iniciar nada, solo marcamos como activo
        // El chat se iniciará cuando el usuario envíe el primer mensaje
        setIsCallActive(true)
        onChatActiveChangeRef.current(true)
        setIsLoading(false)
      }
      
    } catch (err: any) {
      console.error('Error al iniciar:', err)
      const errorMessage = err?.error?.message || err?.message || 'Error desconocido'
      
      if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        setError('Error de permisos. Verifica que tu Public Key y Assistant ID sean correctos en .env.local')
      } else {
        setError(mode === 'voice' 
          ? `No se pudo iniciar la llamada: ${errorMessage}`
          : `No se pudo iniciar el chat: ${errorMessage}`)
      }
      setIsLoading(false)
      setChatMode(null)
    }
  }

  const handleEndCall = async () => {
    console.log('handleEndCall llamado, isCallActive:', isCallActive, 'vapiRef.current:', !!vapiRef.current)
    
    // Para modo texto, no necesitamos vapiRef.current
    if (chatMode === 'text') {
      setIsCallActive(false)
      onChatActiveChange(false)
      onChatStateChange('idle')
      setTranscripts([])
      setIsLoading(false)
      setChatMode(null)
      setTextInput('')
      setPreviousChatId(undefined)
      return
    }
    
    if (!vapiRef.current) {
      console.error('vapiRef.current es null, limpiando estado local')
      setIsCallActive(false)
      onChatActiveChange(false)
      onChatStateChange('idle')
      setTranscripts([])
      setIsLoading(false)
      return
    }

    // Limpiar timeout inmediatamente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Intentar múltiples métodos para terminar la llamada
    try {
      // Método 1: Usar end() que envía un mensaje end-call y destruye el objeto Daily
      console.log('Intentando terminar con end()...')
      vapiRef.current.end()
      console.log('end() llamado exitosamente')
    } catch (err) {
      console.error('Error con end(), intentando stop()...', err)
      try {
        // Método 2: Usar stop() que es una Promise
        console.log('Intentando terminar con stop()...')
        await vapiRef.current.stop()
        console.log('stop() completado exitosamente')
      } catch (stopErr) {
        console.error('Error con stop(), intentando send(end-call)...', stopErr)
        try {
          // Método 3: Enviar mensaje end-call directamente
          console.log('Intentando terminar con send(end-call)...')
          vapiRef.current.send({ type: 'end-call' })
          console.log('send(end-call) llamado exitosamente')
        } catch (sendErr) {
          console.error('Error con send(end-call):', sendErr)
        }
      }
    }
    
    // Limpiar estado local después de un breve delay para dar tiempo a que VAPI procese
    setTimeout(() => {
      console.log('Limpiando estado local después de terminar llamada')
      setIsCallActive(false)
      onChatActiveChange(false)
      onChatStateChange('idle')
      setTranscripts([])
      setIsLoading(false)
      setChatMode(null)
      setTextInput('')
      setPreviousChatId(undefined) // Limpiar contexto del chat
    }, 300)
  }

  // Función para enviar mensaje de texto usando el endpoint /chat de VAPI
  const handleSendTextMessage = async () => {
    if (!textInput.trim() || !isCallActive || chatMode !== 'text') {
      return
    }

    const messageText = textInput.trim()
    setTextInput('')
    
    // Agregar el mensaje del usuario inmediatamente a los transcripts
    const userMessage = {
      role: 'user',
      text: messageText,
      timestamp: Date.now()
    }
    
    // Actualizar estado del shader a user-speaking
    onChatStateChangeRef.current('user-speaking')
    lastRoleRef.current = 'user'
    
    try {
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID
      
      if (!assistantId) {
        setError('NEXT_PUBLIC_VAPI_ASSISTANT_ID no está configurado')
        return
      }

      // Agregar mensaje del usuario y del bot (inicialmente vacío) a transcripts
      setTranscripts(prev => {
        const newTranscripts = [...prev, userMessage, {
          role: 'assistant',
          text: '',
          timestamp: Date.now()
        }]
        return newTranscripts
      })

      // Usar nuestro endpoint de API como proxy (usa API Key del servidor)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assistantId: assistantId,
          message: messageText,
          previousChatId: previousChatId
        })
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      // Leer la respuesta streaming
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No se pudo leer la respuesta')
      }

      const decoder = new TextDecoder()
      let fullResponse = ''
      let currentChatId: string | undefined = previousChatId

      // El índice del mensaje del bot será el último elemento (después de agregar usuario y bot)
      // Usamos una función que calcula el índice dinámicamente

      // Actualizar estado del shader a bot-speaking
      onChatStateChangeRef.current('bot-speaking')
      lastRoleRef.current = 'assistant'

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6))
              
              // Capturar el chatId del primer evento
              if (event.id && !currentChatId) {
                currentChatId = event.id
                setPreviousChatId(event.id)
              }

              // Acumular el contenido del mensaje
              if (event.path && event.delta) {
                fullResponse += event.delta
                
                // Actualizar el mensaje del bot en tiempo real (siempre será el último elemento)
                setTranscripts(prev => {
                  const updated = [...prev]
                  const lastIndex = updated.length - 1
                  if (lastIndex >= 0 && updated[lastIndex].role === 'assistant') {
                    updated[lastIndex] = {
                      ...updated[lastIndex],
                      text: fullResponse
                    }
                  }
                  return updated
                })
              }
            } catch (parseErr) {
              console.error('Error parseando evento SSE:', parseErr)
            }
          }
        }
      }

      // Después de recibir la respuesta completa, volver a idle después de un delay
      setTimeout(() => {
        onChatStateChangeRef.current('idle')
      }, 1500)

    } catch (err: any) {
      console.error('Error al enviar mensaje de texto:', err)
      setError('No se pudo enviar el mensaje. Intenta de nuevo.')
      
      // Remover el mensaje del bot vacío si hubo error (mantener el mensaje del usuario)
      setTranscripts(prev => {
        const updated = [...prev]
        // Remover el último elemento si es del asistente y está vacío
        if (updated.length > 0 && updated[updated.length - 1].role === 'assistant' && updated[updated.length - 1].text === '') {
          return updated.slice(0, -1)
        }
        return updated
      })
      
      // Volver a idle
      onChatStateChangeRef.current('idle')
    }
  }

  // Manejar Enter en el input de texto
  const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendTextMessage()
    }
  }

  return (
    <>
      {/* Botones y controles debajo del shader */}
      <div 
        ref={containerRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center gap-3"
      >
        {!isCallActive ? (
          // Selección de modo antes de iniciar
          <div className="flex flex-col gap-3 items-center">
            <div className="flex gap-3">
              <button
                onClick={() => handleStartCall('voice')}
                disabled={isLoading || !VAPI_PUBLIC_KEY}
                className="px-6 py-3 bg-[#ABFF2E] hover:bg-[#9AE82A] text-black rounded-full transition-all font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
              >
                {isLoading && chatMode === 'voice' ? (
                  <>
                    <span className="animate-spin text-xl">⏳</span>
                    <span>Iniciando...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">🎤</span>
                    <span>Voice</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => handleStartCall('text')}
                disabled={isLoading || !VAPI_PUBLIC_KEY}
                className="px-6 py-3 bg-[#6835F9] hover:bg-[#5A2DE8] text-white rounded-full transition-all font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
              >
                {isLoading && chatMode === 'text' ? (
                  <>
                    <span className="animate-spin text-xl">⏳</span>
                    <span>Iniciando...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">💬</span>
                    <span>Chat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          // Botón para finalizar
          <button
            onClick={handleEndCall}
            className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all font-semibold text-base flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <span className="text-xl">📞</span>
            <span>Finalizar {chatMode === 'voice' ? 'Llamada' : 'Chat'}</span>
          </button>
        )}

        {/* Mensajes de error/aviso */}
        {error && (
          <div className="px-4 py-2 bg-red-100 border border-red-400 text-red-700 rounded-full text-sm max-w-md text-center">
            {error}
          </div>
        )}

        {!VAPI_PUBLIC_KEY && (
          <div className="px-4 py-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-full text-sm max-w-md text-center">
            ⚠️ Configura NEXT_PUBLIC_VAPI_PUBLIC_KEY en tu archivo .env.local
          </div>
        )}

        {/* Indicador de estado cuando la llamada está activa */}
        {isCallActive && (
          <div className="px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-xs text-gray-600">
            {chatMode === 'voice' ? '🎤 Conversación por voz activa' : '💬 Chat por texto activo'}
          </div>
        )}
      </div>

      {/* Input de texto para modo chat - siempre fijo en bottom-24 */}
      {isCallActive && chatMode === 'text' && (
        <div className="absolute left-1/2 transform -translate-x-1/2 z-25 w-full max-w-2xl px-8 bottom-24">
          <div className="flex gap-2 items-center backdrop-blur-lg bg-white/30 rounded-full px-4 py-3 shadow-lg border border-white/20">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={handleTextInputKeyDown}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-sm font-medium"
              disabled={isLoading}
            />
            <button
              onClick={handleSendTextMessage}
              disabled={!textInput.trim() || isLoading}
              className="px-4 py-2 bg-[#6835F9] hover:bg-[#5A2DE8] text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm font-semibold"
            >
              <span>Enviar</span>
              <span>➤</span>
            </button>
          </div>
        </div>
      )}

      {/* Contenedor de transcripciones con efecto flotante integrado */}
      {isCallActive && transcripts.length > 0 && (
        <div className={`absolute left-1/2 transform -translate-x-1/2 z-20 w-full max-w-2xl px-8 ${
          chatMode === 'text' ? 'bottom-36' : 'bottom-24'
        }`}>
          <div 
            ref={transcriptsContainerRef}
            className="relative max-h-64 overflow-y-auto pb-4"
            style={{
              maskImage: 'linear-gradient(to top, black 0%, black 70%, rgba(0,0,0,0.5) 85%, transparent 100%), linear-gradient(to left, black 0%, rgba(0,0,0,0.8) 10%, transparent 20%), linear-gradient(to right, black 0%, rgba(0,0,0,0.8) 10%, transparent 20%)',
              WebkitMaskImage: 'linear-gradient(to top, black 0%, black 70%, rgba(0,0,0,0.5) 85%, transparent 100%), linear-gradient(to left, black 0%, rgba(0,0,0,0.8) 10%, transparent 20%), linear-gradient(to right, black 0%, rgba(0,0,0,0.8) 10%, transparent 20%)',
              scrollBehavior: 'smooth',
            }}
          >
            <div className="space-y-3 flex flex-col">
              {transcripts.map((transcript, index) => (
                <div
                  key={index}
                  className={`inline-block backdrop-blur-lg rounded-full px-5 py-2.5 max-w-[75%] ${
                    transcript.role === 'user'
                      ? 'bg-[#6835F9]/25 text-gray-900 ml-auto text-right self-end'
                      : 'bg-[#ABFF2E]/25 text-gray-900 mr-auto text-left self-start'
                  }`}
                  style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  <p className="text-sm font-medium leading-relaxed">
                    {transcript.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

