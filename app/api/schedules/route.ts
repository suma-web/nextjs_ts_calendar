import { auth } from '@/auth'
import { getPrisma } from '@/lib/prisma'

function isFiveMinuteIncrement(date: Date) {
  return date.getMinutes() % 5 === 0
    && date.getSeconds() === 0
    && date.getMilliseconds() === 0
}

async function getAuthenticatedEmail() {
  const session = await auth()
  const email = session?.user?.email?.trim().toLowerCase()

  return email || null
}

export async function GET() {
  try {
    const ownerEmail = await getAuthenticatedEmail()

    if (!ownerEmail) {
      return Response.json(
        { error: 'authentication required' },
        { status: 401 },
      )
    }

    const prisma = getPrisma()

    const data = await prisma.schedule.findMany({
      where: {
        ownerEmail,
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    return Response.json(data)
  } catch (error) {
    console.error('Failed to fetch schedules', error)

    return Response.json(
      { error: 'failed to fetch schedules' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const ownerEmail = await getAuthenticatedEmail()

    if (!ownerEmail) {
      return Response.json(
        { error: 'authentication required' },
        { status: 401 },
      )
    }

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

    if (
      !isFiveMinuteIncrement(startTime)
      || !isFiveMinuteIncrement(endTime)
    ) {
      return Response.json(
        { error: 'startTime and endTime must be in five-minute increments' },
        { status: 400 },
      )
    }

    const schedule = await prisma.schedule.create({
      data: {
        ownerEmail,
        title,
        date,
        startTime,
        endTime,
      },
    })

    return Response.json(schedule, { status: 201 })
  } catch (error) {
    console.error('Failed to create schedule', error)

    return Response.json(
      { error: 'failed to create schedule' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const ownerEmail = await getAuthenticatedEmail()

    if (!ownerEmail) {
      return Response.json(
        { error: 'authentication required' },
        { status: 401 },
      )
    }

    const prisma = getPrisma()
    const body = await request.json()
    const id = typeof body.id === 'string' ? body.id : ''
    const title =
      typeof body.title === 'string' ? body.title.trim() : ''

    if (!id) {
      return Response.json(
        { error: 'id is required' },
        { status: 400 },
      )
    }

    if (!title) {
      return Response.json(
        { error: 'title is required' },
        { status: 400 },
      )
    }

    const existingSchedule = await prisma.schedule.findFirst({
      where: {
        id,
        ownerEmail,
      },
    })

    if (!existingSchedule) {
      return Response.json(
        { error: 'schedule not found' },
        { status: 404 },
      )
    }

    const schedule = await prisma.schedule.update({
      where: {
        id: existingSchedule.id,
      },
      data: { title },
    })

    return Response.json(schedule)
  } catch (error) {
    console.error('Failed to update schedule', error)

    return Response.json(
      { error: 'failed to update schedule' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const ownerEmail = await getAuthenticatedEmail()

    if (!ownerEmail) {
      return Response.json(
        { error: 'authentication required' },
        { status: 401 },
      )
    }

    const prisma = getPrisma()
    const body = await request.json()
    const id = typeof body.id === 'string' ? body.id : ''

    if (!id) {
      return Response.json(
        { error: 'id is required' },
        { status: 400 },
      )
    }

    const result = await prisma.schedule.deleteMany({
      where: {
        id,
        ownerEmail,
      },
    })

    if (result.count === 0) {
      return Response.json(
        { error: 'schedule not found' },
        { status: 404 },
      )
    }

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete schedule', error)

    return Response.json(
      { error: 'failed to delete schedule' },
      { status: 500 },
    )
  }
}
