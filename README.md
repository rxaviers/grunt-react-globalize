> I18n support for React applications using Globalize.

## Getting Started
This plugin requires Grunt `>=0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-react-globalize --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-react-globalize');
```

## React Globalize task
_Run this task with the `grunt react-globalize` or `grunt react-globalize:extract` command._

Task options may be specified according to the grunt [Configuring tasks]() guide.

TODO

### Options

This task primarily delegates to [React Globalize][], so please consider the [React Globalize documentation][] as required reading for advanced configuration.

[React Globalize]: https://github.com/rxaviers/react-globalize
[React Globalize documentation]: http://github.com/rxaviers/react-globalize/#README


#### mangle
Type: `Boolean` `Object`  
Default: `{}`

Turn on or off mangling with default options. If an `Object` is specified, it is passed directly to `ast.mangle_names()` *and* `ast.compute_char_frequency()` (mimicking command line behavior). [View all options here](https://github.com/mishoo/UglifyJS2#mangler-options).

#### compress
Type: `Boolean` `Object`  
Default: `{}`

Turn on or off source compression with default options. If an `Object` is specified, it is passed as options to `UglifyJS.Compressor()`. [View all options here](https://github.com/mishoo/UglifyJS2#compressor-options).

#### beautify
Type: `Boolean` `Object`  
Default: `false`

Turns on beautification of the generated source code. An `Object` will be merged and passed with the options sent to `UglifyJS.OutputStream()`. [View all options here](https://github.com/mishoo/UglifyJS2#beautifier-options)

###### expression
Type: `Boolean`  
Default: `false`

Parse a single expression, rather than a program (for parsing JSON)

#### report
Choices: `'min'`, `'gzip'`  
Default: `'min'`

Either report only minification result or report minification and gzip results.
This is useful to see exactly how well clean-css is performing but using `'gzip'` will make the task take 5-10x longer to complete. [Example output](https://github.com/sindresorhus/maxmin#readme).

#### sourceMap
Type: `Boolean`  
Default: `false`

If `true`, a source map file will be generated in the same directory as the `dest` file. By default it will have the same basename as the `dest` file, but with a `.map` extension.

#### sourceMapName
Type: `String`  `Function`  
Default: `undefined`

To customize the name or location of the generated source map, pass a string to indicate where to write the source map to. If a function is provided, the uglify destination is passed as the argument and the return value will be used as the file name.

#### sourceMapIn
Type: `String`  `Function`  
Default: `undefined`

The location of an input source map from an earlier compilation, e.g. from CoffeeScript. If a function is provided, the
uglify source is passed as the argument and the return value will be used as the sourceMap name. This only makes sense
when there's one source file.

#### sourceMapIncludeSources
Type: `Boolean`  
Default: `false`

Pass this flag if you want to include the content of source files in the source map as sourcesContent property.

###### sourceMapRoot
Type: `String`  
Default: `undefined`

With this option you can customize root URL that browser will use when looking for sources.

If the sources are not absolute URLs after prepending of the `sourceMapRoot`, the sources are resolved relative to the source map.

###### enclose
Type: `Object`  
Default: `undefined`

Wrap all of the code in a closure with a configurable arguments/parameters list.
Each key-value pair in the `enclose` object is effectively an argument-parameter pair.

#### wrap
Type: `String`  
Default: `undefined`

Wrap all of the code in a closure, an easy way to make sure nothing is leaking.
For variables that need to be public `exports` and `global` variables are made available.
The value of wrap is the global variable exports will be available as.

#### maxLineLen
Type: `Number`  
Default: `32000`

Limit the line length in symbols. Pass maxLineLen = 0 to disable this safety feature.

#### ASCIIOnly
Type: `Boolean`  
Default: `false`

Enables to encode non-ASCII characters as \uXXXX.

#### exportAll
Type: `Boolean`  
Default: `false`

When using `wrap` this will make all global functions and variables available via the export variable.

#### preserveComments
Type: `Boolean` `String` `Function`  
Default: `undefined`  
Options: `false` `'all'` `'some'`

Turn on preservation of comments.

- `false` will strip all comments
- `'all'` will preserve all comments in code blocks that have not been squashed or dropped
- `'some'` will preserve all comments that start with a bang (`!`) or include a closure compiler style directive (`@preserve` `@license` `@cc_on`)
- `Function` specify your own comment preservation function. You will be passed the current node and the current comment and are expected to return either `true` or `false`

#### banner
Type: `String`  
Default: empty string

This string will be prepended to the minified output.  Template strings (e.g. `<%= config.value %>` will be expanded automatically.

#### footer
Type: `String`  
Default: empty string

This string will be appended to the minified output.  Template strings (e.g. `<%= config.value %>` will be expanded automatically.

#### screwIE8
Type: `Boolean`  
Default: false

Pass this flag if you don't care about full compliance with Internet Explorer 6-8 quirks.

#### mangleProperties
Type: `Boolean`  
Default: false

Use this flag to turn on object property name mangling.

#### reserveDOMProperties
Type: `Boolean`  
Default: false

Use this flag in conjunction with `mangleProperties` to prevent built-in browser object properties from being mangled.

#### exceptionsFiles
Type: `Array`  
Default: []

Use this with `mangleProperties` to pass one or more JSON files containing a list of variables and object properties
that should not be mangled. See the [UglifyJS docs](https://www.npmjs.com/package/uglify-js) for more info on the file syntax.

#### nameCache
Type: `String`  
Default: empty string

A string that is a path to a JSON cache file that uglify will create and use to coordinate symbol mangling between
multiple runs of uglify. Note: this generated file uses the same JSON format as the `exceptionsFiles` files.

#### quoteStyle
Type: `Integer`  
Default: `0`

Preserve or enforce quotation mark style.

* `0` will use single or double quotes such as to minimize the number of bytes (prefers double quotes when both will do)
* `1` will always use single quotes
* `2` will always use double quotes
* `3` will preserve original quotation marks

### Usage examples

#### Basic compression

This configuration will compress and mangle the input files using the default options.

```js
// Project configuration.
grunt.initConfig({
  uglify: {
    my_target: {
      files: {
        'dest/output.min.js': ['src/input1.js', 'src/input2.js']
      }
    }
  }
});
```

#### No mangling

Specify `mangle: false` to prevent changes to your variable and function names.

```js
// Project configuration.
grunt.initConfig({
  uglify: {
    options: {
      mangle: false
    },
    my_target: {
      files: {
        'dest/output.min.js': ['src/input.js']
      }
    }
  }
});
```

#### Reserved identifiers

You can specify identifiers to leave untouched with an `except` array in the `mangle` options.

```js
// Project configuration.
grunt.initConfig({
  uglify: {
    options: {
      mangle: {
        except: ['jQuery', 'Backbone']
      }
    },
    my_target: {
      files: {
        'dest/output.min.js': ['src/input.js']
      }
    }
  }
});
```

#### Source maps

Generate a source map by setting the `sourceMap` option to `true`. The generated
source map will be in the same directory as the destination file. Its name will be the
basename of the destination file with a `.map` extension. Override these
defaults with the `sourceMapName` attribute.

```js
// Project configuration.
grunt.initConfig({
  uglify: {
    my_target: {
      options: {
        sourceMap: true,
        sourceMapName: 'path/to/sourcemap.map'
      },
      files: {
        'dest/output.min.js': ['src/input.js']
      }
    }
  }
});
```

#### Advanced source maps

Set the `sourceMapIncludeSources` option to `true` to embed your sources directly into the map. To include
a source map from a previous compilation pass it as the value of the `sourceMapIn` option.

```js
// Project configuration.
grunt.initConfig({
  uglify: {
    my_target: {
      options: {
        sourceMap: true,
        sourceMapIncludeSources: true,
        sourceMapIn: 'example/coffeescript-sourcemap.js', // input sourcemap from a previous compilation
      },
      files: {
        'dest/output.min.js': ['src/input.js'],
      },
    },
  },
});
```

Refer to the [UglifyJS SourceMap Documentation](http://lisperator.net/uglifyjs/codegen#source-map) for more information.

#### Turn off console warnings

Specify `drop_console: true` as part of the `compress` options to discard calls to `console.*` functions.
This will supress warning messages in the console.

```js
// Project configuration.
grunt.initConfig({
  uglify: {
    options: {
      compress: {
        drop_console: true
      }
    },
    my_target: {
      files: {
        'dest/output.min.js': ['src/input.js']
      }
    }
  }
});
```

#### Beautify

Specify `beautify: true` to beautify your code for debugging/troubleshooting purposes.
Pass an object to manually configure any other output options passed directly to `UglifyJS.OutputStream()`.

See [UglifyJS Codegen documentation](http://lisperator.net/uglifyjs/codegen) for more information.

_Note that manual configuration will require you to explicitly set `beautify: true` if you want traditional, beautified output._

```js
// Project configuration.
grunt.initConfig({
  uglify: {
    my_target: {
      options: {
        beautify: true
      },
      files: {
        'dest/output.min.js': ['src/input.js']
      }
    },
    my_advanced_target: {
      options: {
        beautify: {
          width: 80,
          beautify: true
        }
      },
      files: {
        'dest/output.min.js': ['src/input.js']
      }
    }
  }
});
```

#### Banner comments

In this example, running `grunt uglify:my_target` will prepend a banner created by interpolating the `banner` template string with the config object. Here, those properties are the values imported from the `package.json` file (which are available via the `pkg` config property) plus today's date.

_Note: you don't have to use an external JSON file. It's also valid to create the `pkg` object inline in the config. That being said, if you already have a JSON file, you might as well reference it._

```js
// Project configuration.
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  uglify: {
    options: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */'
    },
    my_target: {
      files: {
        'dest/output.min.js': ['src/input.js']
      }
    }
  }
});
```

#### Conditional compilation

You can also enable UglifyJS conditional compilation. This is commonly used to remove debug code blocks for production builds.

See [UglifyJS global definitions documentation](http://lisperator.net/uglifyjs/compress#global-defs) for more information.

```js
// Project configuration.
grunt.initConfig({
  uglify: {
    options: {
      compress: {
        global_defs: {
          "DEBUG": false
        },
        dead_code: true
      }
    },
    my_target: {
      files: {
        'dest/output.min.js': ['src/input.js']
      }
    }
  }
});
```

#### Compiling all files in a folder dynamically

This configuration will compress and mangle the files dynamically.

```js
// Project configuration.
grunt.initConfig({
  uglify: {
    my_target: {
      files: [{
          expand: true,
          cwd: 'src/js',
          src: '**/*.js',
          dest: 'dest/js'
      }]
    }
  }
});
```

#### Turn on object property name mangling

This configuration will turn on object property name mangling, but not mangle built-in browser object properties.
Additionally, variables and object properties listed in the `myExceptionsFile.json` will be mangled. For more info,
on the format of the exception file format please see the [UglifyJS docs](https://www.npmjs.com/package/uglify-js).

```js
// Project configuration.
grunt.initConfig({
  uglify: {
    options: {
      mangleProperties: true,
      reserveDOMCache: true,
      exceptionsFiles: [ 'myExceptionsFile.json' ]
    },
    my_target: {
      files: {
        'dest/output.min.js': ['src/input.js']
      }
    }
  }
});
```

#### Turn on use of name mangling cache

Turn on use of name mangling cache to coordinate mangled symbols between outputted uglify files. uglify will the
generate a JSON cache file with the name provided in the options. Note: this generated file uses the same JSON format
as the `exceptionsFiles` files.

```js
// Project configuration.
grunt.initConfig({
  uglify: {
    options: {
      nameCache: '.tmp/grunt-uglify-cache.json',
    },
    my_target: {
      files: {
        'dest/output1.min.js': ['src/input1.js'],
        'dest/output2.min.js': ['src/input2.js']
      }
    }
  }
});
```

