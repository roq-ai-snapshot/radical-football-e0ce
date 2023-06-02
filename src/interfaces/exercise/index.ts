import { TrainingProgramInterface } from 'interfaces/training-program';

export interface ExerciseInterface {
  id?: string;
  name: string;
  description?: string;
  training_program_id: string;

  training_program?: TrainingProgramInterface;
  _count?: {};
}
