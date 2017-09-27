module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			development: {
				src: [
					'src/map.js',
					'src/bestiary.js',
					'src/npcs.js',
					'src/global.js',
					'src/game.js',
					'src/party.js',
					'src/dungeon.js',
					'src/battle.js'
				],
				dest: 'game.js'
			}
		},
		watch: {
			files: ['src/*.js'],
			tasks: ['concat']
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['concat', 'watch']);
};