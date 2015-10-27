/// <reference path="/bjs/dist/babylon.2.2.js" />

"use strict";

window.addEventListener('DOMContentLoaded', function () {
    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');

    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    // Create global cube
    var scene;
    var camera; 

    // createScene function that creates and return the scene
    var createScene = function () {
        // create a basic BJS Scene object
        scene = new BABYLON.Scene(engine);
        
        // create a FreeCamera, and set its position to (x:6, y:5, z:-10)
        camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, 20), scene);
        //camera = new BABYLON.ArcRotateCamera("arcCamera", 1, 0.8, 50, new BABYLON.Vector3(0, 1, 0), scene);
        //camera.keysUp = [];
        //camera.keysDown = [];
        //camera.keysLeft = [];
        //camera.keysRight = [];



        // target the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // attach the camera to the canvas
        camera.attachControl(canvas, false);
        camera.checkCollisions = true;

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


        //Ground                                                                              // W,   H,  #subdiv, MinHeight, MaxHeight, Scene, Updateable (boolean)  
        //var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "/img/mountains.jpg", 200, 200, 100, 0, 20, scene, false);
        var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "/img/mountain2.png", 200, 200, 100, 0, 20, scene, false);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);

        groundMaterial.diffuseTexture = new BABYLON.Texture("/img/texture2.jpg", scene);
        //groundMaterial.diffuseTexture = new BABYLON.Texture("/img/sand.jpg", scene);
        groundMaterial.diffuseTexture.uScale = 6; //6
        groundMaterial.diffuseTexture.vScale = 6; //6
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground.position.y = -5.0;
        ground.material = groundMaterial;
        ground.checkCollisions = true;

        // Call createRobot
        createRobot(); 

        // return the created scene
        return scene;
    }

    var createRobot = function () {

        var tireFL; var tireFR;
        var tireRL; var tireRR;
        var allTires = new Array();
        var CreateTires = function () {

            var matTire = new BABYLON.StandardMaterial("matTire", scene);
            matTire.emissiveColor = new BABYLON.Vector3(0.4, 0.4, 0.4);

            tireFL = new BABYLON.Mesh.CreateBox("t1", 1.5, scene);
            tireFR = new BABYLON.Mesh.CreateBox("t2", 1.5, scene);
            tireRL = new BABYLON.Mesh.CreateBox("t3", 1.5, scene);
            tireRR = new BABYLON.Mesh.CreateBox("t4", 1.5, scene);
            

            tireFL.material = matTire;
            tireFR.material = matTire;
            tireRL.material = matTire;
            tireRR.material = matTire;

            tireFR.position = new BABYLON.Vector3(-3, 1, -2);
            tireFL.position = new BABYLON.Vector3(3, 1, -2);
            tireRR.position = new BABYLON.Vector3(-3, 1, 1.6);
            tireRL.position = new BABYLON.Vector3(3, 1, 1.6);

            allTires.push(tireFR);
            allTires.push(tireFL);
            allTires.push(tireRL);
            allTires.push(tireRR);
        }

        var centerCar; var boundingBox;
        var carMat;
        var CreateCar = function () {
            carMat = new BABYLON.StandardMaterial("carMat", scene);

            centerCar = new BABYLON.Mesh.CreateBox("center", 0.2, scene);

            boundingBox = new BABYLON.Mesh.CreateBox("main", 7, scene);
            boundingBox.visibility = 0.0;

            var car = new BABYLON.Mesh.CreateBox("main", 3, scene);
            car.scaling.z = 2.5;
            car.scaling.y = 0.4;
            car.scaling.x = 1.4;
            car.position.y = 1;

            car.parent = centerCar;
            car.material = carMat;

            CreateTires();

            tireFR.parent = centerCar;
            tireFL.parent = centerCar;
            tireRR.parent = centerCar;
            tireRL.parent = centerCar;

        };

        CreateCar();

        //KEYS
        var turnLeft = false; var turnRight = false;
        var accelerate = false; var breaking = false;
        window.addEventListener("keydown", function (evt) {

            if (!scene)
                return;

            //console.log(evt.keyCode);

            if (evt.keyCode == 32) {

            }


            //Key LEFT
            if (evt.keyCode == 37) {
                turnLeft = true;
                turnRight = false;

            }

            //Key RIGHT
            if (evt.keyCode == 39) {
                turnLeft = false;
                turnRight = true;
            }

            //Key UP
            if (evt.keyCode == 38) {
                accelerate = true;
                breaking = false;

            }

            //Key BACK
            if (evt.keyCode == 40) {
                breaking = true;
                accelerate = false;
            }

        });

        window.addEventListener("keyup", function (evt) {

            if (evt.keyCode == 37 || evt.keyCode == 39) {
                turnLeft = false;
                turnRight = false;
            }

            if (evt.keyCode == 38 || evt.keyCode == 40) {
                accelerate = false;
                breaking = false;
            }
        });



        //ANIMATION
        var speed = 0;
        scene.registerBeforeRender(function () {

            if (scene.isReady()) {

                camera.target = centerCar.position;

                //SPEED
                if (accelerate && speed < 0.5) {
                    speed += 0.02;
                } else if (speed > 0 && breaking) {
                    speed -= 0.03;
                } else if (speed > 0 && !breaking) {
                    speed -= 0.01;
                }
                else if (Math.round(speed) == 0) {
                    speed = 0;
                    tireFL.rotation.y = 0;
                    tireFR.rotation.y = 0;
                }

                //ROTATION
                //no turn if no speed
                if (speed > 0) {
                    if (turnLeft) {
                        centerCar.rotation.y -= 0.03;
                        tireFL.rotation.y = -Math.PI / 6;
                        tireFR.rotation.y = -Math.PI / 6;
                    } else if (turnRight) {
                        centerCar.rotation.y += 0.03;
                        tireFL.rotation.y = Math.PI / 6;
                        tireFR.rotation.y = Math.PI / 6;
                    } else {
                        tireFL.rotation.y = 0;
                        tireFR.rotation.y = 0;
                    }
                }

                for (var i = 0; i < allTires.length; i++) {
                    allTires[i].rotation.x -= speed;
                }



                

                //POSITION
                centerCar.position.z -= Math.cos(centerCar.rotation.y) * speed;
                centerCar.position.x -= Math.sin(centerCar.rotation.y) * speed;

                boundingBox.position = centerCar.position;
                boundingBox.rotation = centerCar.rotation;

            }
        }); 
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
