import * as yup from 'yup';
import { attendanceValidationSchema } from 'validationSchema/attendances';

export const eventValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  date: yup.date().required(),
  team_id: yup.string().nullable().required(),
  attendance: yup.array().of(attendanceValidationSchema),
});
