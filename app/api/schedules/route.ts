import { getPrisma } from '@/lib/prisma'

export async function GET() {
  const prisma = getPrisma()

  const data = await prisma.schedule.findMany()
  return Response.json(data)
}