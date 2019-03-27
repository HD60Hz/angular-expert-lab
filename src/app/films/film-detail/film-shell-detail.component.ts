import { Component, OnInit } from '@angular/core';
import { FilmService } from '../services/film.service';
import { Film } from '../../models/film';

@Component({
    selector: 'app-film-shell-detail',
    templateUrl: './film-shell-detail.component.html'
})
export class FilmShellDetailComponent implements OnInit {

  pageTitle: string = 'Film Detail';

  film: Film | null;

  constructor(private filmService: FilmService) { }

  ngOnInit() {
    this.filmService.selctedFilmChange$.subscribe(
        film => this.film = film
      );
  }
}
