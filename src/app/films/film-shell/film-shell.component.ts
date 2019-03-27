import { Component, OnInit } from '@angular/core';
import { Film } from '../../models/film';
import { FilmService } from '../services/film.service';

@Component({
    templateUrl: './film-shell.component.html'
})
export class FilmShellComponent implements OnInit {
    pageTitle =  'Films';
    monthCount: number;

    currentFilm: Film | null;

    constructor(private filmService: FilmService) { }

    ngOnInit() {
        this.filmService.selctedFilmChange$.subscribe(
            currentFilm => this.currentFilm = currentFilm
        );
    }

}
