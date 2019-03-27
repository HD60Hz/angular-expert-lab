import { ActivatedRoute } from '@angular/router';
import { FilmService } from './film.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Film } from './film';
import { Store, select } from '@ngrx/store';

import * as fromFilm from './state/film-reducers';
import * as filmAction from './state/film-actions';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css']
})
export class FilmsComponent implements OnInit {

  pageTitle = 'Films';
  imageWidth = 50;
  imageMargin = 2;
  showImage = false;
  errorMessage = '';

  private _listFilter = '';

  filteredFilms: Film[] = [];
  films: Film[] = [];


  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredFilms = this.listFilter ? this.performFilter(this.listFilter) : this.films;
  }


  constructor(private filmService: FilmService, private route: ActivatedRoute, private store: Store<fromFilm.FilmState>) {}

  ngOnInit(): void {
    const filterBy = this.route.snapshot.queryParamMap.get('filterBy');
    this._listFilter = filterBy ? filterBy: '' ;
    this.showImage = JSON.parse(this.route.snapshot.queryParamMap.get('showImage'));

    this.filmService.getFilms().subscribe(
      films => {
        this.films = films;
        this.filteredFilms = this.performFilter(this.listFilter);
      },
      error => this.errorMessage = <any>error
    );

    this.store.pipe(select(fromFilm.getShowImage)).subscribe(
      showImage => this.showImage = showImage
    );
  }

  performFilter(filterBy: string): Film[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.films.filter((film: Film) =>
      film.filmName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  checkChanged(): void {
    this.showImage = !this.showImage;
    this.store.dispatch(new filmAction.ActionCreator(this.showImage));
  }
}
