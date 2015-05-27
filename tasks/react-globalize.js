/**
 * I18n support for React applications using Globalize.
 *
 * Copyright Rafael Xavier de Souza
 * Released under the MIT license
 * https://github.com/rxaviers/grunt-react-globalize/blob/master/LICENSE-MIT
 */

"use strict";

module.exports = function(grunt) {

  var assert = require("assert");
  var fs = require("fs");
  var path = require("path");

  grunt.registerTask("react-globalize", function() {
    var compiler;
    var options = this.options();

    function forEachBuild(locale, iterator) {
      Object.keys(options.build).forEach(function(dest) {
        var modules = options.build[dest];
        var reactElements = [];
        var messages = [];
        modules.forEach(function(module) {

          // Concat messages.
          module = options.modules[module];
          messages.push(grunt.file.readJSON(varReplace(module.messages, {locale: locale})));

          // Concat reactElements.
          reactElements.push(module.reactElements);
        });
        iterator(messages, reactElements, dest);
      });
    }

    function generateBundles() {
      options.locales.forEach(function(locale) {
        forEachBuild(locale, function(messages, reactElements, dest) {

          // Generate bundle.
          var builtContent = compiler.generateBundle(locale, messages, reactElements, {
            onBuildWrite: options.onBuildWrite
          });
          dest = varReplace(dest, {locale: locale});
          grunt.file.mkdir(path.dirname(dest));
          fs.writeFileSync(dest, builtContent);
          grunt.log.writeln("Generated `" + dest + "`.");
        });
      });
    }

    function generateTranslationTable() {
      Object.keys(options.modules).map(function(module) {
        var defaultTranslation, dest;
        module = options.modules[module];

        dest = varReplace(module.messages, {locale: options.defaultLocale});

        // Generate translation template.
        defaultTranslation = compiler.generateDefaultTranslation(options.defaultLocale, module.reactElements);
        grunt.file.mkdir(path.dirname(dest));
        fs.writeFileSync(dest, compiler.stringify(defaultTranslation));
        grunt.log.writeln("Generated `" + dest + "` using the default translation.");

        // Populate new translations for other locales using default.
        options.locales.filter(function(locale) {
          return locale !== options.defaultLocale;
        }).forEach(function(locale) {
          var dest = varReplace(module.messages, {locale: locale});
          var translation = grunt.file.exists(dest) ? grunt.file.readJSON(dest) : {};
          translation = compiler.initOrUpdateTranslation(locale, translation, options.defaultLocale);
          if (translation) {
            fs.writeFileSync(dest, compiler.stringify(translation));
            grunt.log.writeln("Populated the new fields of `" + dest + "` using the default translation.");
          }
        });
      });
    }

    function varReplace(string, vars) {
      return string.replace(/{[a-zA-Z]+}/g, function(name) {
        name = name.replace(/^{([^}]*)}$/, "$1");
        return vars[name];
      });
    }

    assert(typeof options.defaultLocale === "string", "must include `defaultLocale` property (e.g., \"en\")");
    assert(Array.isArray(options.locales), "must include `locales` property (e.g., [\"en\", \"pt\"])");
    assert(typeof options.modules === "object", "must include `modules` property (e.g., {app: {messages: ..., reactElements: ...}})");
    Object.keys(options.modules).forEach(function(name) {
      assert(typeof options.modules[name].messages === "string", "module[\"" + name + "\"] must include `messages` (e.g., \"translations/{locale}.json\")");
      assert(typeof options.modules[name].reactElements === "function", "module[\"" + name + "\"]` must include `reactElements` function");
    });
    Object.keys(options.build).forEach(function(name) {
      assert(Array.isArray(options.build[name]), "build[\"" + name + "\"] must define an Array of modules (e.g., {\"dist/{locale}.js\": [\"app\"]})");
    });

    compiler = require("react-globalize-compiler");

    if (options.amd) {
      compiler.amd(options.amd.config);
    }
    generateTranslationTable();
    generateBundles();
  });

};
