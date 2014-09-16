/*

Copies the assets directory over to /build

*/

var shell = require("shelljs");

module.exports = function(grunt) {

  grunt.registerTask("copy", "Copy assets directory", function() {
    if (grunt.file.exists("src/assets")) shell.cp("-r", "src/assets", "build");
    //pym needs to be separate if it is installed, for the parent
    if (grunt.file.exists("src/js/lib/pym.js/src/pym.js")) shell.cp("src/js/lib/pym.js/src/pym.js", "build");
  });

}