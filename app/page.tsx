'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Scene from '@/components/Scene'
import ChatbotContainer from '@/components/ChatbotContainer'
import StructuredData from '@/components/StructuredData'

export default function Home() {
  const [chatState, setChatState] = useState<'idle' | 'user-speaking' | 'bot-speaking'>('idle')
  const [isChatActive, setIsChatActive] = useState(false)
  
  // Memoizar las callbacks para evitar re-renders innecesarios en ChatbotContainer
  const handleChatStateChange = useCallback((state: 'idle' | 'user-speaking' | 'bot-speaking') => {
    console.log('Home - chatState cambiando a:', state)
    setChatState(state)
  }, [])
  
  const handleChatActiveChange = useCallback((active: boolean) => {
    console.log('Home - isChatActive cambiando a:', active)
    setIsChatActive(active)
  }, [])

  return (
    <>
      {/* Structured Data para SEO */}
      <StructuredData />
      
      <main className="relative w-full h-screen overflow-hidden bg-white">
        {/* Header con logo */}
        <header className="absolute top-0 left-0 right-0 z-20 p-6">
          <div className="max-w-7xl mx-auto">
            <Image
              src="/logo-ideapunkt.svg"
              alt="Ideapunkt - Tecnología e Inteligencia Artificial"
              width={200}
              height={80}
              className="h-12 md:h-16 w-auto"
              priority
            />
          </div>
        </header>

        {/* Frase principal arriba del shader */}
        <div className="absolute top-24 md:top-32 left-1/2 transform -translate-x-1/2 z-30 text-center px-4 w-full">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter leading-tight" style={{ letterSpacing: '-0.05em' }}>
            <span className="block">TRANSFORM YOUR BUSINESS</span>
            <span className="block">WITH TECHNOLOGY</span>
          </h1>
          {/* Indicador de versión para verificación */}
          <div className="mt-4 text-xs text-gray-500 opacity-50" id="version-indicator" data-version="2.0" data-build="1763038018480" data-timestamp="2025-01-14">
            v2.0 - build-1763038018480 - ACTUALIZADO 2025-01-14
          </div>
        </div>

        {/* Shader */}
        <Scene isChatActive={isChatActive} chatState={chatState} />

        {/* Chatbot VAPI */}
        <ChatbotContainer
          onChatStateChange={handleChatStateChange}
          onChatActiveChange={handleChatActiveChange}
        />
      </main>
    </>
  )
}

