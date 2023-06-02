import { ExerciseInterface } from 'interfaces/exercise';
import { PlayerTrainingProgramInterface } from 'interfaces/player-training-program';
import { CoachInterface } from 'interfaces/coach';

export interface TrainingProgramInterface {
  id?: string;
  name: string;
  description?: string;
  coach_id: string;
  exercise?: ExerciseInterface[];
  player_training_program?: PlayerTrainingProgramInterface[];
  coach?: CoachInterface;
  _count?: {
    exercise?: number;
    player_training_program?: number;
  };
}
