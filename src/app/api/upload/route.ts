export const runtime = "nodejs";

import { NextRequest } from 'next/server'
import { handleUpload } from './service'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  return handleUpload(request, formData)
}
