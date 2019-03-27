NgRx
====

# Définition de quelques termes #

Redux Pattern : 

Le Pattern Redux permet de mettre en place une gestion d'etats grace a un worflow cyclique.

3 Principes fondamentales :
	- Single source of truth : 
	La seule source d'information est stocké dans ce que l'on appelle le store 
	
	- State readOnly : 
	Le State est en readOnly et peux seulement etre changer par le fait de dispatcher une actions.
	On parle d'immutabilité
	
	- Changes are made using pure functions:
	Les changement doivent etre apporté par des fonctions pure appelé reducers.
	Pour rappel la notion de pure fonction désigne une fonction qui ne prend en compte que ses parametres d'entrée et ne modifie aucune donnée a part sa valeur de retour.
	
	
Définition : 

Store : simple objet javascript qui va garder le state de l'application.
On peux le voir comme une sorte de base de donnée coté client

Action : simple objet javascript composé d'un 'type' string et d'une payload qui peux prendre n'importe quel type objet.
Le principe d'immutabilité doit s'appliquer pour l'action. Si nous devons effectuer des changement sur l'action, nous allons en creer une nouvelle et non modifier une partie de celle qui existe.

Reducers : fonction qui défini comment le state change quand une certaine action est dispatché

Avantage d'utiliser le Pattern Redux:

Avoir un etat immutable centralisé a un endroit.
Améliore la performance si on doit utiliser le change detection strategy.
Plus facilement testable car nous avons des pures functions


* installation :
```bash
npm i @ngrx/store
```
Hands-On !!!!

Nous allons maintenant devoir importer le store pour pouvoir l'utiliser sur l'application.
Le store prendra en argument un reducer, qui est celui qui va se charger de mettre a jour le store en en créant un nouveau.

Dans le App Module: 
import { StoreModule } from "@ngrx/store";

puis dans les imports : 
StoreModule.forRoot({}) 
=> remarque : pour l'instant nous n'avons pas encore creer de reducer, nous lui passons donc un objet vide.
Comme pour les routes, nous utiliserons ici la fonction forRoot dans le module principal, et for feature dans les autres modules. 

Nous allons utiliser ngrx sur les films, nous allons donc placer l'import dans le film module.

Dans le Film Module: 
import { StoreModule } from "@ngrx/store";

puis dans les imports : 
StoreModule.forFeature('films', {})
=> remarque, ici, nous allons donner un nom a la feature, puis déclarer un ou une liste de reducer.

Nous allons maintenant creer notre reducer pour pouvoir l'associé a la feature: 
----
```typescript
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
```
---

Nous allons devoir creer l'action qui va nous servir a enclancher le reducer : 

---------
```typescript
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
```
---------

Maintenant que cela est fait, nous allons utiliser nos elements ngrx pour lancer une action.
Rendez vous dans le component film pour dispatcher l'action et l'associer au clic Afficher/Cacher : 


 ```typescript
  checkChanged(): void {
    this.showImage = !this.showImage;
    this.store.dispatch(new filmAction.ActionCreator(this.showImage));
  }
  ```

Tout est fait maintenant, seulement nous ne recevons pas l'information car nous y avons pas encore souscrit.
Nous y souscrivons dans le onInit du component : 

```typescript
 this.store.pipe(select(fromFilm.getShowImage)).subscribe(
      showImage => this.showImage = showImage
    );
```
============================
step-02
============================

installer l'outils redux pour voir les différents états : 
npm install @ngrx/store-devtools --save

Nous allons ensuite l'importer dans notre module principale pour pouvoir l'utiliser : 

```typescript
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
```
puis dans les imports : 
   ```typescript
    StoreDevtoolsModule.instrument({
      
    })
    ```
    