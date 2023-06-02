import { PlayerInterface } from 'interfaces/player';
import { TrainingProgramInterface } from 'interfaces/training-program';

export interface PlayerTrainingProgramInterface {
  id?: string;
  player_id: string;
  training_program_id: string;

  player?: PlayerInterface;
  training_program?: TrainingProgramInterface;
  _count?: {};
}
