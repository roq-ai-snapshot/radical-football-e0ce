import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { attendanceValidationSchema } from 'validationSchema/attendances';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.attendance
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getAttendanceById();
    case 'PUT':
      return updateAttendanceById();
    case 'DELETE':
      return deleteAttendanceById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAttendanceById() {
    const data = await prisma.attendance.findFirst(convertQueryToPrismaUtil(req.query, 'attendance'));
    return res.status(200).json(data);
  }

  async function updateAttendanceById() {
    await attendanceValidationSchema.validate(req.body);
    const data = await prisma.attendance.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteAttendanceById() {
    const data = await prisma.attendance.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
