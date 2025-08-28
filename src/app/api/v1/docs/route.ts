import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const openApiPath = join(process.cwd(), 'src/app/api/v1/openapi.json')
    const openApiSpec = await readFile(openApiPath, 'utf-8')
    const spec = JSON.parse(openApiSpec)
    
    return NextResponse.json(spec, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  } catch (error) {
    console.error('Failed to load OpenAPI spec:', error)
    return NextResponse.json(
      { error: 'Failed to load API documentation' },
      { status: 500 }
    )
  }
}
