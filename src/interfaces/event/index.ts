import { AttendanceInterface } from 'interfaces/attendance';
import { TeamInterface } from 'interfaces/team';

export interface EventInterface {
  id?: string;
  name: string;
  description?: string;
  date: Date;
  team_id: string;
  attendance?: AttendanceInterface[];
  team?: TeamInterface;
  _count?: {
    attendance?: number;
  };
}
