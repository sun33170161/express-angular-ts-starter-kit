module.exports = function (grunt) {
    "use strict";
    var serverSrc = "./server"
    var serverDest = "./dist"

    grunt.initConfig({
        copy: {
            server: {
                files: [
                    {
                        expand: true,
                        cwd: serverSrc + "/bin",
                        src: ["**"],
                        dest: serverDest + "/bin"
                    },
                    {
                        expand: true,
                        cwd: serverSrc + "/public",
                        src: ["**"],
                        dest: serverDest + "/public"
                    },
                    {
                        expand: true,
                        cwd: serverSrc + "/views",
                        src: ["**"],
                        dest: serverDest + "/views"
                    },
                    {
                        expand: true,
                        cwd: serverSrc + "/config",
                        src: ["**"],
                        dest: serverDest + "/config"
                    }
                ]
            },
            client: {
                files:[
                    {
                        expand: true,
                        cwd: "client",
                        src: ["**", "!**/*.ts"],
                        dest: 'dist/client/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        ts: {
            server: {
                files: [{
                    src: [serverSrc + "/app/\*\*/\*.ts", "!" + serverSrc + "/app/.baseDir.ts"],
                    dest: serverDest + "/app"
                }],
                options: {
                    module: "commonjs",
                    target: "es6",
                    rootDir: serverSrc + "/app",
                    sourceMap: false
                }
            },
            client: {
                files: [{
                    src: ["client/**/*.ts", "!client/**/*.spec.ts"],
                    dest: "dist/client"
                }],
                options: {
                    module: "system",
                    target: "es5",
                    sourceMap: true,
                    rootDir: "client",
                    moduleResolution: "node",
                    experimentalDecorators: true,
                    lib: [ "es6", "dom" ]
                    
                }
            }
        },
        watch: {
            serverTs: {
                files: [serverSrc + "/app/\*\*/\*.ts"],
                tasks: ["ts"]
            },
            serverCopy: {
                files: [serverSrc + "/views/**/*.pug", serverSrc + "/public/**/*", serverSrc + "/config/**/*"],
                tasks: ["copy"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-ts");

    grunt.registerTask("default", [
        "copy:server",
        "ts:server",
    ]);

    grunt.registerTask("watch:server", [
        "watch:serverTs",
        "watch:serverCopy"
    ]);
};
