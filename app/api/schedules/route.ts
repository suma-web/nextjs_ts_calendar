import { getPrisma } from '@/lib/prisma'

export async function GET() {
  try {
    const prisma = getPrisma()

    const data = await prisma.schedule.findMany({
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

    const schedule = await prisma.schedule.update({
      where: { id },
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
    const prisma = getPrisma()
    const body = await request.json()
    const id = typeof body.id === 'string' ? body.id : ''

    if (!id) {
      return Response.json(
        { error: 'id is required' },
        { status: 400 },
      )
    }

    await prisma.schedule.delete({
      where: { id },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete schedule', error)

    return Response.json(
      { error: 'failed to delete schedule' },
      { status: 500 },
    )
  }
}
