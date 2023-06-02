import * as yup from 'yup';
import { trainingProgramValidationSchema } from 'validationSchema/training-programs';

export const coachValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  team_id: yup.string().nullable().required(),
  training_program: yup.array().of(trainingProgramValidationSchema),
});
