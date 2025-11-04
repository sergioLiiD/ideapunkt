'use client'

import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import ShaderBackground from './ShaderBackground'

interface SceneProps {
  isChatActive?: boolean
  chatState?: 'idle' | 'user-speaking' | 'bot-speaking'
}

export default function Scene({ 
  isChatActive = false,
  chatState = 'idle' 
}: SceneProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Ajustar parámetros del shader según el estado del chat
  const getShaderParams = () => {
    switch (chatState) {
      case 'user-speaking':
        return { intensity: 1.2, speed: 1.5 }
      case 'bot-speaking':
        return { intensity: 1.0, speed: 0.8 }
      default:
        return { intensity: 1.0, speed: 1.0 }
    }
  }

  const params = getShaderParams()

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-white">
      <div className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] max-w-[90vw] max-h-[90vh]">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 70 }}
        gl={{ 
          alpha: false, 
          antialias: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%', background: '#fff' }}
      >
          <color attach="background" args={['#ffffff']} />
          <ShaderBackground 
            intensity={params.intensity}
            speed={params.speed}
            isActive={true}
            chatState={chatState}
          />
        </Canvas>
      </div>
    </div>
  )
}

