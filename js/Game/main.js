/// <reference path="/bjs/dist/babylon.2.2.js" />
"use strict";

var scene;

var Babylon = function () {
    this.canvas = document.getElementById("renderCanvas");

    // Check if browers is support
    if (!BABYLON.Engine.isSupported()) {
        window.alert('Browser not supported');
    } else {

        // Babylon
        var engine = new BABYLON.Engine(canvas, true);

        var newScene;


        // Loading the scene from initScene.js
        newScene = CreateScene(engine);

        // Get cube functionality
        cube = createCube()

        //Validating
        //newScene.activeCamera.attachControl(canvas);
        newScene.activeCamera.attachControl(canvas, false); 
        scene = newScene;

        // Once the scene is loaded, just register a render loop to render it
        engine.runRenderLoop(function () {
            if (scene)

                //do something with cube

                scene.render();
        });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });
    }


};