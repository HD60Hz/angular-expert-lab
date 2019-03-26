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

* Importer RxJs 
```typeScript
import { Observable } from 'rxjs';
//--------------------------
export class ATeamComponent{
  public pageTitle = 'Bienvenue';
  imageWidth: number = 100;
  numbers = [0, 3, 7, 5];
  sourceFrom$ = from(this.numbers);

  constructor() {
    this.sourceFrom$.subscribe(
      value => console.log(`value: ${value}`),
      e => console.log(`error: ${e}`),
      () => console.log("complete")
    );
  }
```

C'est juste un tableau, oui dans notre exmple, mais peut être que le tableau va être mis à jour par des webSocket et moi je dois observer ses valeurs pour faire un traitement 

Par convention les observable il faut les postfixer par '$'

A la souscription, on doit déclarer trois fonctions :
* onNext()  : C'est la fonction obligatoir à implémenter lors de la souscription, elle est appelée chaque foit qu'un élément sera émis par l'Observable
```typeScript 
value => console.log(`value: ${value}`),
```
* onComplete()  : appelée quand l'Observable termine avec succès son émission de données
```typeScript 
e => console.log(`error: ${e}`),
```
* onError()  : appelée si une erreur se produit lors de l'émission d'un élément par l'Observable et arrête l'observable
```typeScript 
() => console.log("complete")
```
Maintenant on va voir une autre façon de créer un Observable, avec Observable.create et pour simuler onError() on va  déclencher une erreur si la valeur égale à stalingrade 

```typeScript
  source$ = Observable.create(observer => {
    for (const nbr of this.numbers) {
      if (nbr === 'Stalingrade') { observer.error('Error into the Observable'); }
      observer.next(nbr);
    }
    observer.complete();
  });
```

Vous avez remarqué que l'observable s'est arrêté brusquement sans qu'il execute la fonction onComplete()

Maintenant on va modifier notre code pour utiliser un timer 

```typeScript
 source$ = Observable.create(observer => {
    let index = 0;
    let getValue = () => {
      observer.next(this.numbers[index++]);
      if (index < this.numbers.length) {
        setTimeout(getValue, 400);
      }
      else {
        observer.complete();
      }
    }
    getValue();
  });
```

Si vous avez remaquez même si on a ajouté un timer et on a récupéré les données d'une manière asynchrone nous avons pas modifier notre subscription  

Parmis les points forts de RxJs c'est les opérateurs, Nous allons  pouvoir chainer plusieurs opérations les unes à la suite des autres, filtrer les résultats... .etc
```typeScript
// parfois vscode bug et récupére pas les dépendances map filter .....
  source$ = Observable.create(observer => {
    let index = 0;
    let getValue = () => {
      observer.next(this.numbers[index++]);
      if (index < this.numbers.length) {
        setTimeout(getValue, 400);
      }
      else {
        observer.complete();
      }
    }
    getValue();
  }).pipe(
    map((nbr:number) => nbr * 2),
    filter((nbr:number) => nbr > 6)
  ); 
```

* Async pipe 
c'est un subscribe qui peut être utiliser dans le html, il n'a pas besoin d'être unsubscribe, il le fait automatiquement quand le component est détruit 

Définition depuis la documentation de Angular 
`The async pipe subscribes to an Observable or Promise and returns the latest value it has emitted. When a new value is emitted, the async pipe marks the component to be checked for changes. When the component gets destroyed, the async pipe unsubscribes automatically to avoid potential memory leaks.`

```typeScript

export class ATeamComponent {
  public pageTitle = 'Film disponible dans notre application : ';
  imageWidth = 100;
  numbers = ['Scarface', 'BraveHeart', 'Gladiator', 'Stalingrade'];

  source$ = Observable.create(observer => {
    let index = 0;
    let getValue = () => {
      observer.next(this.numbers[index++]);
      if (index == this.numbers.length) {
        index = 0;
      }
      setTimeout(getValue, 2000);

    }
    getValue();
  });
```
```html
  <div class="card-header">
    {{pageTitle}} {{source$ | async}}
  </div>
```

A chaque subscription il faut ajouter unsubscribe dans le ngDestroy du component



