import { randomBytes, createHash } from 'crypto'
import { prisma } from './prisma'

export interface ApiKeyResult {
  id: string
  name: string
  key: string // Only returned on creation
  hash: string
  applicationId: string
  userId: string
  createdAt: Date
  lastUsedAt: Date | null
  revoked: boolean
}

export class ApiKeyService {
  /**
   * Generate a new API key with format: sk_live_<32_random_chars>
   */
  static generateKey(): string {
    const randomPart = randomBytes(16).toString('hex')
    return `sk_live_${randomPart}`
  }

  /**
   * Hash an API key for secure storage
   */
  static hashKey(key: string): string {
    return createHash('sha256').update(key).digest('hex')
  }

  /**
   * Create a new API key for an application
   */
  static async createApiKey(
    applicationId: string,
    userId: string,
    name: string
  ): Promise<ApiKeyResult> {
    const key = this.generateKey()
    const hash = this.hashKey(key)

    const apiKey = await prisma.apiKey.create({
      data: {
        applicationId,
        userId,
        name,
        hash,
      },
    })

    return {
      ...apiKey,
      key, // Only return the raw key on creation
    }
  }

  /**
   * Validate an API key and return the associated data
   */
  static async validateKey(key: string): Promise<{
    apiKey: any
    application: any
    user: any
  } | null> {
    const hash = this.hashKey(key)

    const apiKey = await prisma.apiKey.findUnique({
      where: { hash },
      include: {
        application: true,
        user: true,
      },
    })

    if (!apiKey || apiKey.revoked) {
      return null
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    })

    return {
      apiKey,
      application: apiKey.application,
      user: apiKey.user,
    }
  }

  /**
   * List API keys for an application (without raw keys)
   */
  static async listKeys(applicationId: string, userId: string) {
    return prisma.apiKey.findMany({
      where: {
        applicationId,
        userId,
      },
      select: {
        id: true,
        name: true,
        hash: false, // Never return hash
        lastUsedAt: true,
        createdAt: true,
        revoked: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  /**
   * Revoke an API key
   */
  static async revokeKey(keyId: string, userId: string): Promise<boolean> {
    const result = await prisma.apiKey.updateMany({
      where: {
        id: keyId,
        userId, // Ensure user can only revoke their own keys
      },
      data: {
        revoked: true,
      },
    })

    return result.count > 0
  }

  /**
   * Delete an API key permanently
   */
  static async deleteKey(keyId: string, userId: string): Promise<boolean> {
    const result = await prisma.apiKey.deleteMany({
      where: {
        id: keyId,
        userId, // Ensure user can only delete their own keys
      },
    })

    return result.count > 0
  }
}
