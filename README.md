Angular Config 
================

Dans le monde réel nous n'avons pas qu'un seul environnement, certainement vous vous êtes posez la question sur comment rendre notre application angular paramétrable selon l'environnement de déploiement.

Quand on crée un projet avec angular-cli, il crée un répertoire environnements avec 2 fichier environnement.ts et environnements.prod.ts, ces fichiers sont référencés dans le fichier angular.json

```json
"configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "extractCss": true,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                }
              ]
            }
          }
```

Mais comment angular va savoir quel fichier doit prendre ?

Quand on va utiliser le ng build ou le ng serve, angular va savoir quelle configuration va utiliser !!!! 

On vous a caché qu'il y a un paramètre à ajouter à ces deux dernière commandes '--configuration'

# Hands-on #

Supposant qu'on a plusieurs environnements où nous allons déployé l'application dev, qualif, pprod et prod, pour chacun de ces environnements on a une url de back-end.

* Créer les fichiers environnements.{env}.ts et ajouter un tableau de apis 

```typeScript
export const environment = {
  production: false,
  apis: [
    {
      id: 'auth',
      url: 'https://localhost',
      options: {}
    },
    {
      id: 'ref',
      url: 'https://localhost',
      options: {}
    },
    {
      id: 'rec',
      url: 'https://localhost',
      options: {}
    }
  ]
};
```
On peut mettre dans les fichiers environnement, les urls de hosts, flag pour le déboggage avec les logs, .etc

__IL NE FAUT PAS METTRE DES INFORMATIONS SENSIBLES COMME LE MOT DE PASSE OU UNE CLE SECRETS DANS LES FICHIERS ENVIRONNEMENT__ 

* Ajouter la partie configuration dans le fichier angular.json

```json
"configurations": {
  "dev": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.dev.ts"
      }
    ]
  },
  "qualif": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.qualif.ts"
      }
    ]
  },
  "pprod": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.qualif.ts"
      }
    ]
  },
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ],
    "optimization": true,
    "outputHashing": "all",
    "sourceMap": false,
    "extractCss": true,
    "namedChunks": false,
    "aot": true,
    "extractLicenses": true,
    "vendorChunk": false,
    "buildOptimizer": true,
    "budgets": [
      {
        "type": "initial",
        "maximumWarning": "2mb",
        "maximumError": "5mb"
      }
    ]
  }
}

```
La config est disponible avec l'utilisation de ng build pour que ça soit utilisable aussi pour ng serve il faut ajouter encore de la config :)

```json
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "browserTarget": "Lab02:build"
  },
  "configurations": {
    "dev": {
      "browserTarget": "Lab02:build:dev"
    },
    "qualif": {
      "browserTarget": "Lab02:build:qualif"
    },
    "pprod": {
      "browserTarget": "Lab02:build:pprod"
    },
    "production": {
      "browserTarget": "Lab02:build:production"
    }
  }
},
```
* Nous allons créer des models pour typer les objets qu'on va utiliser 
Créer un répertoire et un fichier models/config.interface.ts
```typeScript
export interface ApiConfig {
  id: string;
  url: string;
  options: Options;
}

export interface Options {
  headers?: Headers;
  withCredentials?: boolean;
}

export interface Headers {
  Authorization: string;
}

export enum Hosts {
  AUTH = 'auth',
  REFERENTIEL = 'ref',
  RECORD = 'rec'
}
```

* Nous allons créer un service juste pour récupérer et configurer les appels GET, POST, .etc

```typeScript
import { ApiConfig } from './../models/config.interface';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // apis provided from environment
  apis: Array<ApiConfig> = new Array();

  constructor(private http: HttpClient) {
    this.apis = environment.apis;
  }

  /**
  * Retrieve an api from id.
  * @param id - api Id.
  */

  getApi(id: string): ApiConfig {
    return this.apis.find((api: any) => api.id === id);
  }

  /**
   * Prepare query args.
   * @param api - api id.
   * @param query - query params.
   */
  prepareQuery(api: any, query: string): string {
    return api ? `${api.url}${query}` : query;
  }

  /**
   * Prepare options method.
   * @param api - api id
   * @param options - options.
   */
  prepareOptions(api: any, options: any = {}): Object {
    return api ? Object.assign({}, options, api.options) : options;
  }

  /**
   * Xhr Get method
   * @param apiName - api environment key
   * @param url - endpoint url
   * @param options - request options
   */
  get<T>(apiName: string, url: string, options?: any): Observable<T> {
    const api = this.getApi(apiName);
    console.log('ENV : api utilisé ', api);
    return this.http.get<T>(this.prepareQuery(api, url), this.prepareOptions(api, options));
  }

  /**
   * Xhr post method
   * @param apiName - api environment key
   * @param url - endpoint url
   * @param data - request data
   * @param options - request options
   */
  post<T>(apiName: string, url: string, data: any, options?: any): Observable<T> {
    const api = this.getApi(apiName);
    return this.http.post<T>(this.prepareQuery(api, url), data, this.prepareOptions(api, options));
  }

  /**
   * Xhr put method
   * @param apiName - api environment key
   * @param url - endpoint url
   * @param data - request data
   * @param options - request options
   */
  put<T>(apiName: string, url: string, data: any, options?: any): Observable<T> {
    const api = this.getApi(apiName);
    return this.http.put<T>(this.prepareQuery(api, url), data, this.prepareOptions(api, options));
  }

  /**
   * Xhr patch method
   * @param apiName - api environment key
   * @param url - endpoint url
   * @param data - request data
   * @param options - request options
   */
  patch<T>(apiName: string, url: string, data: any, options?: any): Observable<T> {
    const api = this.getApi(apiName);
    return this.http.patch<T>(this.prepareQuery(api, url), data, this.prepareOptions(api, options));
  }

  /**
   * Xhr delete method
   * @param apiName - api environment key
   * @param url - endpoint url
   * @param options - request options
   */
  delete<T>(apiName: string, url: string, options?: any): Observable<T> {
    const api = this.getApi(apiName);
    return this.http.delete<T>(this.prepareQuery(api, url), this.prepareOptions(api, options));
  }
}
```

* Utiliser le service ApiService

Nous allons faire le test directement dans FilmService
```typeScript
constructor(private http: HttpClient, private apiService: ApiService) {
    console.log(apiService.apis);
  }
  
getFilms(): Observable<Film[]> {
  if (this.films) {
    return of(this.films);
  }
  return this.apiService.get<Film[]>(Hosts.RECORD, this.filmsUrl).pipe(
    tap(data => console.log(JSON.stringify(data))),
    tap(data => this.films = data),
    catchError(this.handleError)
  );
}
```
Nous allons arrêter l'application et la lancer avec ng serve --configuration=pprod

Ouvrez la console, bravo oui nous utilison le host de pprod (y) 


