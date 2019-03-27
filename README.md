Schematics
============

Quand vous utilisez angular/cli pour génerer un component, service, .etc, vous utilisez les scematics, l'équipe Angular nous ont données l'accès à leurs outils de travail afin de nous faciliter la vie, puisqu'ils sachent qu'on est des faineants :), c'était une blague bien sûr.
```
     A                          A
    /\      => schematics =>   /|\
    B C                       D B C'
```
C'est un générateur qui va modifier les fichiers systèmes dans une 'stash Area' et les mettres dans le répertoir cible, si jamais il y a un problème, toute les modifications sont annulé (Transactionnel).

Il faut savoir que c'est possible de l'utiliser avec n'importe quelle techno front React, Vue.js

Points Fort :

* Amélioré la productivité 
* Réutilisation de code 
* Agir sur la structure du projet

# Hands-Up 8-) je voulais dire Hands-on #

Avant de commencer, nous allons avoir besoin d'installer schematics-cli

```bash
npm install -g @angular-devkit/schematics-cli
```
et angular-cli 
```bash
npm install @angular/cli
```
* A partir de maintenant, nous allons pouvoir utiliser la magie de schematics-cli 

```bash
cd ..
schematics schematic --name schematics-examples
```
ou
```bash
cd ..
schematics blank --name schematics-lab
```
package.json : fichier de dépendances et il pointe vers  collection.json
collection.json : le fichier qui va décrire la liste de nos schématics 
schematics-lab : Le répertoire du schématic 
schematics-lab/index.js : Chaque schematic va avoir un index.ts, c'est la où on va exporter notre fonction Rule Factory

* Nous allons ajouter deux fichiers schema.ts et schema.json

'schema.json' : pour présenter les options du schema  
```json
{
    "$schema": "http://json-schema.org/schema",
    "id": "HelloATeam",
    "title": "Hello Schematic by A-Team",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "The name of the person .",
            "$default": {
                "$source": "argv",
                "index": 0
            },
            "x-prompt": "what is your name ?"
        }
    }
}
```

'schema.ts' : Pour typer les options 
```typeScript
export class HelloOptions{
    name?: string;
}
```
Mettre à jour le collection.json
```json
{
  "$schema": "../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "schematics-lab": {
      "description": "hello schematic by angular team Open.",
      "factory": "./schematics-lab/index#schematicsLab",
      "aliases":["salam-alikom", "salut", "hola", "hello"],
      "schema": "./schematics-lab/schema.json"
    }
  }
}
```

Jusqu'à maintenant, notre schematic fait rien nous allons modifier le index.ts pour créer un html avec un hello

```typeScript
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { HelloOptions } from './schema';
export function schematicsLab(_options: HelloOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    tree.create("hello-a-team.html", `<h1>Hello ${_options.name} i'm kharchoufa-Man 👳</h1>`);
    return tree;
  };
}
```
* Le moment de la vérité

Pour tester suivez les instructions suivantes :
- cd /to_your_workspace/
- ng new test-schema-lab
- cd test-schema-lab
- npm link ./....../schematics-lab/
- ng g schematics-lab:salam-alikom --name=nabil
- Supprimer le fichier html générer
- ng g schematics-lab:salam-alikom
Le message :), juste pour essayer est-ce que les features de Angular 7 fonctionnent bien (y)


![alt text](https://media.giphy.com/media/1oE3E7g9PPWt1L0Ia8/giphy.gif)

Il est content, il faut lui pardonner c'est un exploit pour lui, mais tous ça pour génerer un html avec hello, c'est débile.

Je n'ai pas encore terminé, nous allons voir comment paramétrer les nom de fchier ajouter des templates de code aussi

# schematic templates #

Nous allons commencer par créer le répertoire files dans notre schema.
Il doit s'appeler files pour qu'il soit exclut de la compilation regarder tsconfig ....

ajouter le fichier `__name@dasherize__.ts` 

double underscore : sépare la var name du reste 
dasherize : fonction utile mour mettre le name dans le format kebab case string (totoTitiTata => toto-titi-tata)

Ajouter les deux fichiers dans files

`__name@dasherize__.service.ts`
```typeScript
import { <%= classify(name) %>Model } from './<%=dasherize(name)%>.model';

export class <%= classify(name) %>Service {

    public items: <%= classify(name) %>Model[] =[
        { type: 'filtre', cssClass: 'ti-filtre' },
        { type: 'inpute', cssClass: 'ti-inpute' },
        { type: 'Select', cssClass: 'ti-Select' },
        { type: 'checkboxe', cssClass: 'ti-checkboxe' }
    ];

}
```
`__name@dasherize__.model.ts`
```typeScript
export interface <%= classify(name) %>Model {
    type: string;
    cssClass: string;
}
```

Comme le php, pour printer la valeur des variables on utilisera les <%= %> c'est possibe d'appeler à l'intérrieur des ces tags des fcts utile comme classify et dasherize

Il reste à modifier le index.ts pour spécifier comment et où ajouter notre fichier 

Pour commencer il faut savoir sur quel workspace on travail dans le 'index.ts'
```typeScript
import { apply, filter, MergeStrategy, mergeWith, move, noop, Rule, SchematicContext, template, Tree, url } 
from '@angular-devkit/schematics/';
import { getWorkspace } from '@schematics/angular/utility/config';
import { buildDefaultPath } from '@schematics/angular/utility/project';
import { parseName } from '@schematics/angular/utility/parse-name';
import { normalize } from '@angular-devkit/core';
import { strings } from '@angular-devkit/core';

export function setupOptions(host: Tree, options: any): Tree {
  const workspace = getWorkspace(host);
  if (!options.project) {
    options.project = Object.keys(workspace.projects)[0];
  }
  const project: any = workspace.projects[options.project];

  if (options.path === undefined) {
    options.path = buildDefaultPath(project);
  }

  const parsedPath = parseName(options.path, options.name);
  options.name = parsedPath.name;
  options.path = parsedPath.path;
  return host;
}

export function ateamSchematicTemplate(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    // récupérer le workspace 
    setupOptions(tree, options);

    // est-ce qu'on dépose le file directement ou il faut lui créer un rep
    const movePath = (options.flat) ?
      normalize(options.path) :
      normalize(options.path + '/' + strings.dasherize(options.name));

      // Filtrer pour récupérer les fichiers source dans files 
    const templateSource = apply(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options,
      }),
      move(movePath),
    ]);

    // à la fin il faut spécifier de quel façon on doit merger le code 
    const rule = mergeWith(templateSource, MergeStrategy.Default);


    return rule(tree, _context);
  };
}
```
# Exemples d'utilisation #

```typeScript
function addPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      { type: NodeDependencyType.Default, version: '~6.1.1', name: '@angular/elements' },
      { type: NodeDependencyType.Default, version: '~1.1.0', name: '@webcomponents/custom-elements' },
      { type: NodeDependencyType.Default, version: '~1.1.0', name: 'angular-made-with-love' }
    ];

    dependencies.forEach(dependency => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
    });

    return host;
  };
}
```
`https://material.angular.io/guide/schematics`

```typeScript
export default function(options: any): Rule {
  return chain([
    options && options.skipPackageJson ? noop() : addPackageJsonDependencies(),
    options && options.skipPackageJson ? noop() : installPackageJsonDependencies(),
    options && options.skipModuleImport ? noop() : addModuleToImports(options),
    options && options.skipPolyfill ? noop() : addPolyfillToScripts(options)
  ]);
}
```
Conclusion
==========

Prenez le temps de bien analyser votre projet, essayer de cibler les features et les tâche qui qui se répetent, utiliser les Schematics. 