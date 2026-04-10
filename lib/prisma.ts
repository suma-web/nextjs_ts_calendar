import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export function getPrisma() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined")
  }

  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg(connectionString)
    globalForPrisma.prisma = new PrismaClient({ adapter })
  }

  return globalForPrisma.prisma
}
