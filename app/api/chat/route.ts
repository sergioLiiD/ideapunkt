import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, assistantId, previousChatId } = body

    if (!message || !assistantId) {
      return new Response(
        JSON.stringify({ error: 'message y assistantId son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Obtener la API Key privada del servidor (NO usar NEXT_PUBLIC_ para claves privadas)
    const apiKey = process.env.VAPI_API_KEY

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'VAPI_API_KEY no está configurada. Agrega tu API Key privada en .env.local' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Hacer la llamada a VAPI desde el servidor
    const response = await fetch('https://api.vapi.ai/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        assistantId: assistantId,
        input: message,
        stream: true,
        ...(previousChatId && { previousChatId })
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(
        JSON.stringify({ error: `Error ${response.status}: ${errorText}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Streamear la respuesta de VAPI al cliente
    const reader = response.body?.getReader()
    if (!reader) {
      return new Response(
        JSON.stringify({ error: 'No se pudo leer la respuesta' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Crear un ReadableStream para enviar al cliente
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder()
        
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) {
            controller.close()
            break
          }

          // Enviar el chunk al cliente
          controller.enqueue(value)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })

  } catch (error: any) {
    console.error('Error en API route /api/chat:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
