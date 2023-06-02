import * as yup from 'yup';
import { attendanceValidationSchema } from 'validationSchema/attendances';
import { playerTrainingProgramValidationSchema } from 'validationSchema/player-training-programs';

export const playerValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  team_id: yup.string().nullable().required(),
  attendance: yup.array().of(attendanceValidationSchema),
  player_training_program: yup.array().of(playerTrainingProgramValidationSchema),
});
