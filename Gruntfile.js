module.exports = function(grunt) {

	'use strict';

	require('time-grunt')(grunt);
	require('jit-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		webpack: {
			dist: {
				entry: './src/index.js',
				output: {
					path: "dist/",
					filename: "renderSelect.js"
				}
			}
		},

		watch: {
			grunt: {
				files: [ 'Gruntfile.js' ]
			},
			src: {
				files: [
					'src/*'
				],
				tasks: ['_develop'],
				options: {
					livereload: true
				}
			},
			options: {
				// spawn: false
			}
		}
	});

	grunt.registerTask('default', ['webpack', 'uglify']);
	grunt.registerTask('_develop', ['webpack']);
	grunt.registerTask('develop', ['webpack', 'watch']);

};