import { EditFilmComponent } from './film-edit/edit-film.component';
import { FilmShellListComponent } from './film-list/film-shell-list.component';
import { FilmShellDetailComponent } from './film-detail/film-shell-detail.component';
import { FilmShellComponent } from './film-shell/film-shell.component';
import { FilmParamsService } from './services/film-params.service';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { FilmResolver } from './services/film-resolver.service';
import { EditFilmBasicInfoComponent } from './film-edit/edit-film-basic-info.component';
import { EditFilmActeursComponent } from './film-edit/edit-film-acteurs.component';

const ROUTES = [
  { path: 'films', component: FilmShellComponent },
  {
    path: 'films/:id/edit',
    component: EditFilmComponent,
    resolve: { film: FilmResolver },
    children: [
      {
        path: '', redirectTo: 'info', pathMatch: 'full'
      },
      {
        path: 'info', component: EditFilmBasicInfoComponent
      },
      {
        path: 'acteurs', component: EditFilmActeursComponent
      }
    ]
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    FilmShellComponent,
    FilmShellDetailComponent,
    FilmShellListComponent,
    FilmShellDetailComponent,
    EditFilmComponent,
    EditFilmBasicInfoComponent,
    EditFilmActeursComponent
  ],
  providers: [FilmParamsService]
})
export class FilmModule { }
