import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { playerTrainingProgramValidationSchema } from 'validationSchema/player-training-programs';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.player_training_program
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPlayerTrainingProgramById();
    case 'PUT':
      return updatePlayerTrainingProgramById();
    case 'DELETE':
      return deletePlayerTrainingProgramById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPlayerTrainingProgramById() {
    const data = await prisma.player_training_program.findFirst(
      convertQueryToPrismaUtil(req.query, 'player_training_program'),
    );
    return res.status(200).json(data);
  }

  async function updatePlayerTrainingProgramById() {
    await playerTrainingProgramValidationSchema.validate(req.body);
    const data = await prisma.player_training_program.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deletePlayerTrainingProgramById() {
    const data = await prisma.player_training_program.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
