/**
 * I18n support for React applications using Globalize.
 *
 * Copyright Rafael Xavier de Souza
 * Released under the MIT license
 * https://github.com/rxaviers/grunt-react-globalize/blob/master/LICENSE-MIT
 */

"use strict";

module.exports = function(grunt) {

  var async = require("async");
  var fs = require("fs");
  var path = require("path");

  grunt.registerTask("react-globalize", function() {
    var actions, config, Globalize, GlobalizeCompiler, React, ReactGlobalize, requirejs, scope;
    var args = this.args;
    var done = this.async();
    var options = this.options({
      onBuildWrite: function(locale, content) {
        return content;
      },
      messages: function() {
        throw new Error("Missing messages. Please, provide either a JSON or a function(locales) that returns them");
      }
    });

    function forEachBuild(locale, iterator) {
      Object.keys(options.build).forEach(function(dest) {
        var modules = options.build[dest];
        var reactElements = [];
        modules.forEach(function(module) {
          var messages;

          module = options.modules[module];
          messages = grunt.file.readJSON(varReplace(module.messages, {locale: locale}));

          // Load messages.
          Globalize.loadMessages(messages);

          // Concat reactElements.
          [].push.apply(reactElements, module.reactElements.call(scope));
        });
        iterator(reactElements, dest);
      });
    }

    function generateBundles(callback) {
      options.locales.forEach(function(locale) {
        forEachBuild(locale, function(reactElements, dest) {
          var builtContent;

          // Set locale.
          Globalize.locale(locale);

          // Have react to render all passed components, therefore the formatters in
          // use will be created in Globalize.cache.
          reactElements.forEach(function(reactElement) {
            React.renderToString(reactElement);
          });

          // Compile all generated formatters.
          dest = varReplace(dest, {locale: locale});
          builtContent = options.onBuildWrite(locale, GlobalizeCompiler(Globalize.cache));

          grunt.file.mkdir(path.dirname(dest));
          fs.writeFileSync(dest, builtContent);
          grunt.log.writeln("Generated `" + dest + "`");

          // Cleanup.
          Globalize.cache = {};
        });
      });
      callback();
    }

    function generateTranslationTemplate(callback) {
      Object.keys(options.modules).map(function(module) {
        var dest, reactElements;
        module = options.modules[module];

        dest = varReplace(module.messages, {locale: options.defaultLocale});
        reactElements = module.reactElements.call(scope);

        // Set default locale.
        Globalize.locale(options.defaultLocale);

        // Have react to render all passed components, therefore the formatters in
        // use will be created in Globalize.cache.
        reactElements.forEach(function(reactElement) {
          React.renderToString(reactElement);
        });

        // Generate translation template.
        grunt.file.mkdir(path.dirname(dest));
        fs.writeFileSync(dest, orderedStringify(ReactGlobalize.defaultMessages));
        grunt.log.writeln("Generated `" + dest + "`");
      });
      callback();
    }

    function loadCldr(callback) {
      if (options.loadCldr.length === 1) {
        try {
          options.loadCldr.call(scope, options.locales);
        } catch(error) {
          return callback(error);
        }
        return callback();
      }
      options.loadCldr.call(scope, options.locales, callback);
    }

    function orderedStringify(obj) {
      return JSON.stringify(obj, function(key, value) {
        if (value instanceof Object && !Array.isArray(value)) {
          return Object.keys(value).sort().reduce(function(ret, key) {
            ret[key] = value[key];
            return ret;
          }, {});
        }
        return value;
      }, "  ");
    }

    function varReplace(string, vars) {
      return string.replace(/{[a-zA-Z]+}/g, function(name) {
        name = name.replace(/^{([^}]*)}$/, "$1");
        return vars[name];
      });
    }

    // AMD.
    if (options.amd) {
      config = options.amd.config;
      config.nodeRequire = require;
      requirejs = require("requirejs");
      requirejs.config(config);
      Globalize = requirejs("globalize");
      GlobalizeCompiler = require(path.join(requirejs.toUrl("globalize"), "../../tool/compiler"));
      React = requirejs("react");
      ReactGlobalize = requirejs("react-globalize");
      scope = {
        React: React,
        requirejs: requirejs
      };
      options.loadCldr = options.loadCldr || function(locales) {
        config["cldr-data"].locales = locales;
        Globalize.load(
          requirejs("cldr-data!entireMain"),
          requirejs("cldr-data!entireSupplemental")
        );
      };

    // CommonJS.
    } else {
      Globalize = require("globalize");
      GlobalizeCompiler = require("globalize/tool/compiler");
      React = require("react");
      ReactGlobalize = require("react-globalize");
      scope = {
        React: React
      };
      options.loadCldr = options.loadCldr || function(locales) {
        Globalize.load(require("cldr-data").entireSupplemental());
        locales.forEach(function(locale) {
          Globalize.load(require("cldr-data").entireMainFor(locale));
        });
      };
    }

    if (args.length && args[0] === "extract") {
      actions = [loadCldr, generateTranslationTemplate];
    } else {
      actions = [loadCldr, generateBundles];
    }
    async.series(actions, function(error) {
      if (error) {
        grunt.log.error(error);
        return done(error);
      }
      if (options.amd) {
        requirejs.config({});
      }
      done();
    });
  });

};
