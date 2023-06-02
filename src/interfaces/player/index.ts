import { AttendanceInterface } from 'interfaces/attendance';
import { PlayerTrainingProgramInterface } from 'interfaces/player-training-program';
import { UserInterface } from 'interfaces/user';
import { TeamInterface } from 'interfaces/team';

export interface PlayerInterface {
  id?: string;
  user_id: string;
  team_id: string;
  attendance?: AttendanceInterface[];
  player_training_program?: PlayerTrainingProgramInterface[];
  user?: UserInterface;
  team?: TeamInterface;
  _count?: {
    attendance?: number;
    player_training_program?: number;
  };
}
