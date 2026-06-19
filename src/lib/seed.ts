import { pathToFileURL } from 'node:url'
import { prisma } from './prisma'

export async function seedDatabase() {
  try {
    // Create a test user
    const user = await prisma.user.upsert({
      where: { email: 'khalid.code03@gmail.com' },
      update: {},
      create: {
        email: 'khalid.code03@gmail.com',
        role: 'admin'
      }
    })

    // Create test applications
    const applications = [
      {
        name: 'Website Assets',
        slug: 'website-assets',
        ownerId: user.id,
        storageDir: 'uploads/website-assets'
      },
      {
        name: 'Mobile App',
        slug: 'mobile-app',
        ownerId: user.id,
        storageDir: 'uploads/mobile-app'
      },
      {
        name: 'User Content',
        slug: 'user-content',
        ownerId: user.id,
        storageDir: 'uploads/user-content'
      }
    ]

    for (const appData of applications) {
      await prisma.application.upsert({
        where: { slug: appData.slug },
        update: {},
        create: appData
      })
    }

    console.log('Database seeded successfully!')
    return { success: true }
  } catch (error) {
    console.error('Error seeding database:', error)
    return { success: false, error }
  }
}

const isDirectRun = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false

if (isDirectRun) {
  seedDatabase()
    .then((result) => {
      if (!result.success) {
        process.exitCode = 1
      }
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
