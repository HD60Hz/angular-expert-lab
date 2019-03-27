Architecture consideration
==========================

Quelques règles à respecter pour penser à celui qui va venir après vous :) 

# Single responsibility #

- 400 lignes de code
- Des petites fonctions
- nomenclature !!!!
Avantages :
- facilité la maintenabilité de code 
- facilité la lecture de code 
- Lazy-loading
- .....

# Flat #

- Garder une structure plat le plus possible 
- regrouper par répertoir quand il y a plus de 7 fichiers

# Folders-by-feature structure #

- Structurer le projet sous forme de fonctionnalité par repert²oir

# Container & presentational components #

Afin de mieux gérer les components on peut les diviser en deux catégories : 

 - Containers component
Il va contenir la logic
intéragir avec les service
Gérer les DI 

 - Presentational component
C'est plus comment on va afficher les données 
Aucune dépendances avec le reste de l'application 
@Output pour émettre un event
@Input pour recevoir les données
 

* Hands-on

 - Créer deux répertoirs containers et components dans films
 - Mettez film-shell dans containers et film-list dans components
 - Corrigez les problèmes d'imports 

 Déplacer toute la logique dans FilmShellComponent et supprimer les subscribe, nous allons utiliser asyncPipe 

 ```typeScript
import { Component, OnInit } from '@angular/core';
import { Film } from '../../../models/film';
import { FilmService } from '../../services/film.service';
import { Observable } from 'rxjs';

@Component({
    templateUrl: './film-shell.component.html'
})
export class FilmShellComponent implements OnInit {
    pageTitle =  'Films';
    monthCount: number;
    // Utiliser les observables
    errorMessage$: Observable<string>;
    films$: Observable<Film[]>;

    currentFilm$: Observable<Film | null>;

    constructor(private filmService: FilmService) { }

    ngOnInit() {
        this.currentFilm$ = this.filmService.selctedFilmChange$;
        this.films$ = this.filmService.getFilms();
    }

    selectCurrentFilm(film: Film): void {
        this.filmService.changeCurrentFilm(film);
    }
}
 ```
Mettre Les donées nécessaire comme input et les fonction comme output pour les events
 ```html
<div class='row' *ngIf='favoris'>
    <div class='col-md-4'>
        <h4>
           Liste des films favoris
        </h4>
    </div>
</div>
<div class='row'>
    <div class="col-md12" *ngIf="currentFilm$ | async as currentFilm">
        Le prix du film choisi est : {{ currentFilm.price | currency:"USD":"symbol":"1.2-2" }}</div>
</div>
<div class='row'>
    <div class='col-md-4'>
        <app-film-shell-list
         [films]="films$ | async" 
         [errorMessage]="errorMessage$ | async" 
         (selected)="selectCurrentFilm($event)"
         >
        </app-film-shell-list>
    </div>
    <div class='col-md-8'>
        <app-film-shell-detail></app-film-shell-detail>
    </div>
</div>
 ```
Notre composant FilmShellListComponent 

```typeScript
import { Component, Input, Output } from '@angular/core';
import { Film } from 'src/app/models/film';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-film-shell-list',
  templateUrl: './film-shell-list.component.html'
})
export class FilmShellListComponent {
  pageTitle: 'Films';
  @Input() films: Film[];
  @Input() errorMessage: string;
  @Output() selected = new EventEmitter<Film>();

  constructor() { }

  selectFilm(film: Film): void {
    this.selected.emit(film);
  }

}
```

```html
<div class="card" *ngIf="films">
  <div id="films" class="row view-group">
    <div *ngFor="let film of films" class="item list-group-item col-md-12  col-sm-12">
      <div class="thumbnail card">
        <div class="caption card-body"><h4 class="group card-title inner list-group-item-heading">
          <button class="btn btn-outline-primary btn-sm" (click)="changeCurrentFilm(film)">
            {{ film.filmName }}
          </button>
        </h4>
        <h4 class="group card-title inner list-group-item-heading">
          <img *ngIf="film.imageUrl" class="group list-group-image img-fluid img-card" [src]="film.imageUrl"
            [title]="film.filmName" style="height: 100px;width: 50px; pull: left">
        </h4>
          <p>
            <pm-star [rating]="film.starRating" class="goldenrod"></pm-star>
          </p>
          <div class="col-xs-12 col-md-6 text-right">

          </div>
        </div>
      </div>
    </div>
  </div>
  <div *ngIf='errorMessage' class='alert alert-danger'>
    Error: {{ errorMessage }}
  </div>
</div>
```

tester, yeah ça fonctionne (y) 

index.ts
========

.... Coming soon

OnPush Change Detection Strategy
================================

.... Coming soon



