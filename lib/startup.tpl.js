
//save main require
var reqo = process.mainModule.require;

var path = reqo('path');
var vm = reqo('vm');

//custom require
function require(modname)
{
    var relpath = path.relative(__dirname, modname);
    if(relpath in files)
    {
        console.log("Found "+ relpath);
        //Create Sandbox for running script
        //TODO add global, process, ...
        var sandbox = ({});
        sandbox.require = require;
        sandbox.exports = ({});
        sandbox.module = {
            id: path.basename(modname, path.extname(modname)),
            exports: sandbox.exports,
            filename: modname,
        };

        //run
        var mod = vm.runInNewContext(files[relpath], sandbox, modname)
        return sandbox.exports;
    }
    else
        return reqo(modname);
}

//replace main require
process.mainModule.require = require;
