# REST API Example: Pokémon Registry

This simple web app provides a form for registering Pokémon, their type(s) and base stats.  More importantly, it also provides a REST API for accessing data about registered Pokémon.  This app was created as a means of practicing implmenting a node app that exposes a RESTful API.

## Installing

Make sure you have [MongoDB](https://www.mongodb.com/download-center#community) installed.

Then,

```
$ git clone https://github.com/checarlos87/restful-pokemon-registry.git
$ cd restful-pokemon-registry
$ npm install
```

## Running

Make sure the MongoDB daemon is running.

Then choose a \<port number> and

```
$ node app.js <port number>
```

## The API

Pokémon are registered through a form located at the root of the app ('/').  After at least one Pokémon has been registered, you can use the REST API to get various information for the registered Pokémon.

### Restrictions on registering Pokémon

The app is meant to register information on Pokémon species and not on specific creatures of a given species.  As such, the app only allows a Pokémon name to be registered only once.  Another consequence of this design decision is that stats registered for a Pokémon are meant to be its [base stats](http://bulbapedia.bulbagarden.net/wiki/Base_stats).

### Look up all info for all Pokémon

* url: ```/api/pokemon```
* returns: An array of JSON objects, each containing the name of a Pokémon, its types, and each of its base stats.

### Looking up all info for a Pokémon

* url: ```/api/pokemon/<pokémon name>```
* example: ```/api/pokemon/pikachu```
* returns: A JSON object with the Pokémon's name, types, and each of its base stats.

### Looking up a Pokémon's type

* url: ```/api/pokemon/<pokémon name>/type```
* example: ```/api/pokemon/pikachu/type```
* returns: A JSON object with the Pokémon's two types.  If the Pokémon only has one type, the value of the ```type2``` field will be ```None```.

### Looking up a specific base stat for a Pokémon

* url: ```/api/pokemon/<pokémon name>/<stat name>```
* example: ```/api/pokemon/pikachu/hp```
* returns: A JSON opject with the value of the requested stat.

Note: The names accepted in <stat name> are shortened versions of the actual names.  The accepted values for each stat are as follows.

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











