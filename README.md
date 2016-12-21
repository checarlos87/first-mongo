# REST API Example: Pokémon Registry

This simple web app provides a form for registering Pokémon, their types and base stats.  More importantly, it also provides a REST API for accessing data about registered Pokémon.  This app was created as an exercise for practicing implmenting a node app that exposes a RESTful API.  It is not meant to be production-ready.

## Installing

Make sure you have [MongoDB](https://www.mongodb.com/download-center#community) installed.

Then,

```
$ git clone https://github.com/checarlos87/restful-pokemon-registry.git
$ cd restful-pokemon-registry
$ npm install
```

### Example dataset

If you are looking for example data to test this app, you can check out [this gist](https://gist.github.com/checarlos87/2550241194ebdb43e94076977d33983b) which contains a MongoDB export of 151 documents corresponding to the original 151 Kanto Pokémon.

## Running

Make sure the MongoDB daemon is running.

Then choose a \<port number> and run

```
$ node app.js <port number>
```

and point your browser to ```localhost:<port number>```.

## The API

Pokémon are registered through a form located at the root of the app ('/').  After at least one Pokémon has been registered, you can use the REST API to get various information for the registered Pokémon.

### Restrictions on registering Pokémon

The app is meant to register information on Pokémon species and not on specific creatures of a given species.  As such, the app only allows a Pokémon name to be registered once.  Another consequence of this design decision is that stats registered for a Pokémon are meant to be its [base stats](http://bulbapedia.bulbagarden.net/wiki/Base_stats).

### Look up all info for all Pokémon

* url: ```/api/pokemon```
* returns: An array of JSON objects, each containing the name of a Pokémon, its types, and each of its base stats.

### Looking up all info for a Pokémon

* url: ```/api/pokemon/<pokemon name>```
* example: ```/api/pokemon/pikachu```
* returns: A JSON object with the Pokémon's name, types, and each of its base stats.

### Looking up a Pokémon's type

* url: ```/api/pokemon/<pokemon name>/type```
* example: ```/api/pokemon/pikachu/type```
* returns: A JSON object with the Pokémon's two types.  If the Pokémon only has one type, the value of the ```type2``` field will be ```None```.

### Looking up a specific base stat for a Pokémon

* url: ```/api/pokemon/<pokemon name>/<stat name>```
* example: ```/api/pokemon/pikachu/atk```
* returns: A JSON opject with the value of the requested stat.

Note: The names accepted in \<stat name> are shortened versions of the actual stat names.  The accepted values for each stat are as follows.

* HP: ```hp```
* Attack: ```atk```
* Defense: ```def```
* Special Attack: ```spa```
* Special Defense: ```spd```
* Speed: ```spe```

### Look up all Pokémon of a specific type

* url: ```/api/type/<type name>```
* example: ```/api/type/electric```
* returns: An array of JSON objects, each containing the name of a Pokémon of the secified type, its types, and each of its base stats.

## Search function

The app also provides a search box at the top for searching for Pokémon by name and displaying the results in HTML.  This is meant to provide an alternative, non-RESTful, human-friendly way of viewing data on registered Pokémon.  A Pokémon's search result page is also the only place where Pokémon may be deleted from the database.
