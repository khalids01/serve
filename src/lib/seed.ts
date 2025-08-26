import { prisma } from './prisma'

export async function seedDatabase() {
  try {
    // Create a test user
    const user = await prisma.user.upsert({
      where: { email: 'admin@serve.dev' },
      update: {},
      create: {
        email: 'admin@serve.dev',
        role: 'ADMIN'
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
