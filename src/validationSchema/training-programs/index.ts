import * as yup from 'yup';
import { exerciseValidationSchema } from 'validationSchema/exercises';
import { playerTrainingProgramValidationSchema } from 'validationSchema/player-training-programs';

export const trainingProgramValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  coach_id: yup.string().nullable().required(),
  exercise: yup.array().of(exerciseValidationSchema),
  player_training_program: yup.array().of(playerTrainingProgramValidationSchema),
});
