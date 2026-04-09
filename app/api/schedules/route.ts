import { getPrisma } from '@/lib/prisma'

export async function GET() {
  const prisma = getPrisma()

  const data = await prisma.schedule.findMany({
    orderBy: {
      startTime: 'asc',
    },
  })

  return Response.json(data)
}

export async function POST(request: Request) {
  const prisma = getPrisma()
  const body = await request.json()

  const title =
    typeof body.title === 'string' ? body.title.trim() : ''
  const date = new Date(body.date)
  const startTime = new Date(body.startTime)
  const endTime = new Date(body.endTime)

  if (!title) {
    return Response.json(
      { error: 'title is required' },
      { status: 400 },
    )
  }

  if (
    Number.isNaN(date.getTime()) ||
    Number.isNaN(startTime.getTime()) ||
    Number.isNaN(endTime.getTime())
  ) {
    return Response.json(
      { error: 'date, startTime, and endTime must be valid dates' },
      { status: 400 },
    )
  }

  if (startTime >= endTime) {
    return Response.json(
      { error: 'startTime must be earlier than endTime' },
      { status: 400 },
    )
  }

  const schedule = await prisma.schedule.create({
    data: {
      title,
      date,
      startTime,
      endTime,
    },
  })

  return Response.json(schedule, { status: 201 })
}
