import {GameDTO} from "../../../domain/dto/GameDTO";

export interface GamesState{
  gamesItems: GameDTO[];
  error: string;
  status: 'pending' | 'loading' | 'error' | 'success';
}
export const initialState: GamesState={
  gamesItems: [],
  error: null,
  status: 'pending',
}
