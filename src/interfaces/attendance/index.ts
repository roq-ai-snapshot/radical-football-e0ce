import { PlayerInterface } from 'interfaces/player';
import { EventInterface } from 'interfaces/event';

export interface AttendanceInterface {
  id?: string;
  player_id: string;
  event_id: string;
  attended: boolean;

  player?: PlayerInterface;
  event?: EventInterface;
  _count?: {};
}
