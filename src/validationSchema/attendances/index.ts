import * as yup from 'yup';

export const attendanceValidationSchema = yup.object().shape({
  attended: yup.boolean().required(),
  player_id: yup.string().nullable().required(),
  event_id: yup.string().nullable().required(),
});
