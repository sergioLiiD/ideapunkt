import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'version.txt')
    const content = readFileSync(filePath, 'utf-8')
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    // Si no encuentra el archivo, devolver el BUILD_ID del .next
    try {
      const buildIdPath = join(process.cwd(), '.next', 'BUILD_ID')
      const buildId = readFileSync(buildIdPath, 'utf-8').trim()
      return new NextResponse(
        `BUILD_ID: ${buildId}\nTIMESTAMP: ${new Date().toISOString().split('T')[0]}\nVERSION: 2.0\nSTATUS: ACTUALIZADO\n`,
        {
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        }
      )
    } catch {
      return new NextResponse('File not found', { status: 404 })
    }
  }
}

