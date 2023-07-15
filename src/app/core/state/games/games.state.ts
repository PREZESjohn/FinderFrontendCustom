import {GameDTO} from "../../../domain/dto/GameDTO";

export interface GamesState{
  gameItems: GameDTO[];
  error: string;
  status: 'pending' | 'loading' | 'error' | 'success';
}
export const initialState: GamesState={
  gameItems: [],
  error: null,
  status: 'pending',
}
