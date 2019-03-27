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
