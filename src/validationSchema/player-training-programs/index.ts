import * as yup from 'yup';

export const playerTrainingProgramValidationSchema = yup.object().shape({
  player_id: yup.string().nullable().required(),
  training_program_id: yup.string().nullable().required(),
});
