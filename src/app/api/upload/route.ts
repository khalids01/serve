import { NextRequest } from 'next/server'
import { handleUpload } from './service'

export async function POST(request: NextRequest) {
  return handleUpload(request)
}
