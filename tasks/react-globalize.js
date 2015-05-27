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
        modules.forEach(function(module) {
          var messages;

          module = options.modules[module];
          messages = grunt.file.readJSON(varReplace(module.messages, {locale: locale}));

          // Load messages.
          compiler.Globalize.loadMessages(messages);

          // Concat reactElements.
          [].push.apply(reactElements, module.reactElements.call(compiler.scope));
        });
        iterator(reactElements, dest);
      });
    }

    function generateBundles() {
      options.locales.forEach(function(locale) {
        forEachBuild(locale, function(reactElements, dest) {

          // Generate bundle.
          var builtContent = compiler.generateBundle(locale, reactElements, {
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
        var defaultTranslation, dest, reactElements;
        module = options.modules[module];

        dest = varReplace(module.messages, {locale: options.defaultLocale});
        reactElements = module.reactElements.call(compiler.scope);

        // Generate translation template.
        defaultTranslation = compiler.generateDefaultTranslation();
        grunt.file.mkdir(path.dirname(dest));
        fs.writeFileSync(dest, defaultTranslation);
        grunt.log.writeln("Generated `" + dest + "` using the default translation.");

        // Populate new translations for other locales using default.
        options.locales.filter(function(locale) {
          return locale !== options.defaultLocale;
        }).forEach(function(locale) {
          var dest = varReplace(module.messages, {locale: locale});
          var translation = grunt.file.exists(dest) ? grunt.file.readJSON(dest) : {};
          translation = compiler.initOrUpdateTranslation(locale, translation, defaultTranslation);
          if (translation) {
            fs.writeFileSync(dest, translation);
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

    compiler = new require("react-globalize-compiler")(options);
    generateTranslationTable();
    generateBundles();
  });

};
