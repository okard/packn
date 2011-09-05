
# packn
a __pack__er for __n__ode

packn can merge multiple js and coffe script files in a single js file, so an application can be combined to one file.

packn replaces the require function of node to load the packed files from created file cache.

## Used Tools

* [node.js](http://nodejs.org/)
* [UglifyJS](https://github.com/mishoo/UglifyJS)
* [coffee-script](http://jashkenas.github.com/coffee-script/)

## Usage

    $ node packn.js foo.js bar.coffee

Results in a packed __out.js

Can be used in node mainModule via

    require("__out.js");


## TODO

* The Startup Script lib/startup.tpl.js still missing some stuff for module loading
* Add Commandline Options






