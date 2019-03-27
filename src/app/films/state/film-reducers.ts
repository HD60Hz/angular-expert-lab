import { FilmActions, FilmActionTypes  } from './film-actions';
import { createFeatureSelector } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
//import or declare state

  // State for this feature (Film)
export interface FilmState {
    showImage: boolean;
  }
const initialState: FilmState = {
    showImage: true
  };

const getFilmFeatureState = createFeatureSelector<FilmState>('films');

export const getShowImage = createSelector(
    getFilmFeatureState,
    state => state.showImage
  );

export function reducer(state = initialState, action: FilmActions) {
    switch (action.type) {
        case FilmActionTypes.ToggleImage: {
            return { ...state, showImage : action.payload };
        }

        default:
            return state;
    }
}
