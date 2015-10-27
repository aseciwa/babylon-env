/// <reference path="/bjs/dist/babylon.2.2.js" />

"use strict";

window.addEventListener('DOMContentLoaded', function () {
    // get the canvas DOM element
    var ccanvas = document.getElementById('renderCanvas');

    // load the 3D engine
    var engine = new BABYLON.Engine(ccanvas, true);

    // Create global cube
    var scene;
    var camera;

    // createScene function that creates and return the scene
    var createScene = function () {
        // create a basic BJS Scene object
        scene = new BABYLON.Scene(engine);

        // create a FreeCamera, and set its position to (x:6, y:5, z:-10)
        camera = new BABYLON.ArcRotateCamera("arcCam", 2, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene); 
        camera.setPosition(new BABYLON.Vector3(75, 1, -50));
        //camera.target = new BABYLON.Vector3(3, 0, 0); 

        camera.lowerBetaLimit = 0.1;
        camera.upperBetaLimit = (Math.PI / 2) * 0.99;
        camera.lowerRadiusLimit = 100;

        // attach the camera to the canvas
        camera.attachControl(canvas, false);
        //camera.checkCollisions = true;

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

        // call rock function
        rocks(); 

        // call ground function
        ground(); 

        // call createModel function
        createModel();

        
      
        // return the created scene
        return scene;
    }

    var ground = function () {

        // ground mesh and heightmap
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("/ground_img/ground03.jpg", scene); 

        var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "/img/mountain2.png", 150, 150, 100, 0, 12, scene, false);
        ground.material = groundMaterial;
        ground.checkCollisions = true; 

    }

    var rocks = function () {

        var rock = new BABYLON.Mesh.CreateSphere("rock1", 10, 1.0, scene);
        rock.position.y = 10;
        rock.position.x = -10; 
    }

    var createModel = function () {

        var blueBox = BABYLON.Mesh.CreateBox("blue", 1, scene);
        var blueMat = new BABYLON.StandardMaterial("ground", scene);
        blueMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        blueMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        blueMat.emissiveColor = BABYLON.Color3.Blue();
        blueBox.material = blueMat;
        blueBox.position.x = 10;
        blueBox.position.y = 0.5;

    }

    // call the createScene function
    scene = createScene();


    /*---------------------*/
    /* run the render loop */
    /*---------------------*/
    engine.runRenderLoop(function () {
        scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });


});
