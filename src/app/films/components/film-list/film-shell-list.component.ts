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

  changeCurrentFilm(film: Film): void {
    this.selected.emit(film);
  }

}
