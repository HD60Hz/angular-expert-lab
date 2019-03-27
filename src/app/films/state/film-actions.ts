import { Action } from '@ngrx/store';

export enum FilmActionTypes {
 ToggleImage = "[Film] TOGGLE",
 ToggleImage_SUCCESS = "[Film] TOGGLE_SUCCESS",
 ToggleImage_FAIL = "[Film] TOGGLE_FAIL"
}

export class ActionCreator implements Action {
    readonly type = FilmActionTypes.ToggleImage;
    constructor(public payload: boolean) { }
}

export class ActionCreatorSuccess implements Action {
    readonly type = FilmActionTypes.ToggleImage_SUCCESS;
    constructor(public payload: boolean) { }
}

export class ActionCreatorFail implements Action {
    readonly type = FilmActionTypes.ToggleImage_FAIL;
    constructor(public payload: boolean) { }
}

export type FilmActions = ActionCreator | ActionCreatorSuccess | ActionCreatorFail;