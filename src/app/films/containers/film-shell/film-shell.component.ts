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
