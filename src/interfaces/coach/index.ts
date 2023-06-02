import { TrainingProgramInterface } from 'interfaces/training-program';
import { UserInterface } from 'interfaces/user';
import { TeamInterface } from 'interfaces/team';

export interface CoachInterface {
  id?: string;
  user_id: string;
  team_id: string;
  training_program?: TrainingProgramInterface[];
  user?: UserInterface;
  team?: TeamInterface;
  _count?: {
    training_program?: number;
  };
}
