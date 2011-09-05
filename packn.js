#!/usr/bin/env node

var fs = require("fs");
var exec = require("child_process").exec;
//uglify-js
var jsp = require("./lib/uglify-js").parser;
var pro = require("./lib/uglify-js").uglify;
//coffee-script
var compile = require("./lib/coffee-script.js").CoffeeScript.compile;

//root obj
({
    outfilename: "__out.js",
    outfile: null,
    
    /**
    * Start up packn
    */
    start: function()
    {
        process.argv.shift();
        process.argv.shift();
        
        //TODO process arguments

        //open output file
        this.outfile = fs.createWriteStream(this.outfilename);

        //prepare loader
        this.outfile.write("var files=({});");
        var tpl = fs.readFileSync('./lib/startup.tpl.js', 'utf8');
        this.outfile.write(this.minify(tpl));
        
        //handle files to pack
        this.processFiles();
    },
    
    /**
    * process Files
    */
    processFiles: function()
    {
        var self = this;
        
        //helper function
        function endsWith(str, s){return str.substr(-s.length) == s;}
        
        //loop through files
        process.argv.forEach(function (val, index, array) 
        {
            console.log("Compress file: " + val);
            
            var content = fs.readFileSync(val, 'utf8');
            
            //compile if it is coffeescript
            if(endsWith(val, ".coffee"))
            {
                content=compile( content, {"bare": "on"});
            }
            
            //minify and add to store file
            var src = self.minify(content);
            self.writeFile(val, new Buffer(src).toString('base64'));
        });
    
    },
    
    /**
    * Write a js file content to script
    */
    writeFile: function(file, str)
    {
        this.outfile.write("\nfiles['"+ file + "']=new Buffer('" + str +"', 'base64').toString('utf8');");
    },
    
    /**
    * minify js code
    */
    minify: function(code)
    {
        var ast = jsp.parse(code); // parse code and get the initial AST
        ast = pro.ast_mangle(ast); // get a new AST with mangled names
        ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
        return pro.gen_code(ast); // compressed code here
    }

}).start();
