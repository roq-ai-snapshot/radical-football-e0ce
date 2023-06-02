import axios from 'axios';
import queryString from 'query-string';
import { PlayerTrainingProgramInterface } from 'interfaces/player-training-program';
import { GetQueryInterface } from '../../interfaces';

export const getPlayerTrainingPrograms = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/player-training-programs${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPlayerTrainingProgram = async (playerTrainingProgram: PlayerTrainingProgramInterface) => {
  const response = await axios.post('/api/player-training-programs', playerTrainingProgram);
  return response.data;
};

export const updatePlayerTrainingProgramById = async (
  id: string,
  playerTrainingProgram: PlayerTrainingProgramInterface,
) => {
  const response = await axios.put(`/api/player-training-programs/${id}`, playerTrainingProgram);
  return response.data;
};

export const getPlayerTrainingProgramById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/player-training-programs/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deletePlayerTrainingProgramById = async (id: string) => {
  const response = await axios.delete(`/api/player-training-programs/${id}`);
  return response.data;
};
