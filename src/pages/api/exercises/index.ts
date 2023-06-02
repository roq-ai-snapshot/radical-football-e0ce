import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { exerciseValidationSchema } from 'validationSchema/exercises';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getExercises();
    case 'POST':
      return createExercise();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getExercises() {
    const data = await prisma.exercise
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'exercise'));
    return res.status(200).json(data);
  }

  async function createExercise() {
    await exerciseValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.exercise.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
