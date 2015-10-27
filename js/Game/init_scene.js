/// <reference path="/bjs/dist/babylon.2.2.js" />

"use strict";

window.addEventListener('DOMContentLoaded', function () {
    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');

    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    // Create global cube
    var cube;
    var scene;

    //angle
    var angle = 15;
    var radius = .9;

    // createScene function that creates and return the scene
    var createScene = function () {
        // create a basic BJS Scene object
        scene = new BABYLON.Scene(engine);

        // create a FreeCamera, and set its position to (x:6, y:5, z:-10)
        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, 20), scene);

        // target the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // attach the camera to the canvas
        camera.attachControl(canvas, false);
        camera.checkCollisions = true;
        //camera.applyGravity = true; 

        // call createSkybox func
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/sky/skybox", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;


        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

        // Create cube
        cube = new BABYLON.Mesh.CreateBox("cube", 2, scene);
        cube.position.y += 10;
        cube.checkCollisions = true;

        // Create flying asteroid with particles
        createParticleSystem(); 


        // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
        //var extraground = babylon.mesh.createground("extraground", 150, 150, 0, scene, false);
        //var extragroundmaterial = new babylon.standardmaterial("extraground", scene);
        //extragroundmaterial.diffusetexture = new babylon.texture("/img/texture2.jpg", scene);
        //extragroundmaterial.diffusetexture.uscale = 60;
        //extragroundmaterial.diffusetexture.vscale = 60;
        //extraground.position.y = -2.10;
        //extraground.material = extragroundmaterial;

        //Ground                                                                              // W,   H,  #subdiv, MinHeight, MaxHeight, Scene, Updateable (boolean)  
        var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "/img/mountains.jpg", 200, 200, 100, 0, 20, scene, false);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("/img/texture2.jpg", scene);
        groundMaterial.diffuseTexture.uScale = 6; //6
        groundMaterial.diffuseTexture.vScale = 6; //6
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground.position.y = -5.0;
        ground.material = groundMaterial;
        ground.checkCollisions = true;


        // return the created scene
        return scene;
    }

    var createParticleSystem = function () {

        var particleSystem = new BABYLON.ParticleSystem("particles", 1000, scene);

        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture("/img/flare.png", scene);

        // Where the particles come from
        particleSystem.emitter = cube; // the starting object, the emitter
        particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

        // Colors of all particles
        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

        // Size of each particle (random between...
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;

        // Life time of each particle (random between...
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1.5;

        // Emission rate
        particleSystem.emitRate = 1500;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles
        particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

        // Direction of each particle after it has been emitted
        particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
        particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

        // Angular speed, in radians
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;

        // Speed
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.005;

        // Start the particle system
        particleSystem.start();
    }

    // call the createScene function
    scene = createScene();


    /*---------------------*/
    /* run the render loop */
    /*---------------------*/
    engine.runRenderLoop(function () {
        //cube.rotation.x += 0.01;
        //cube.rotation.y += 0.01; 

        cube.position.x += 0.01;
        cube.position.x += radius * Math.cos(angle);
        cube.position.y += radius * Math.sin(angle);
        angle += Math.PI / 180; 

        scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });
});
