import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  // Generar contenido único con timestamp
  const timestamp = Date.now()
  const buildId = process.env.NEXT_BUILD_ID || 'unknown'
  
  const content = `ESTE_ARCHIVO_ES_UNICO_2025_01_14_BUILD_1763038018480
Si ves este mensaje, los archivos nuevos se están sirviendo correctamente.
Timestamp: ${new Date().toISOString()}
Unix Timestamp: ${timestamp}
Build ID: ${buildId}
Status: ARCHIVOS_NUEVOS_SERVIDOS_CORRECTAMENTE
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })
}

