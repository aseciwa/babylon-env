/// <reference path="/bjs/dist/babylon.2.2.js" />

var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);
var scene;
var camera;
var earth;
var clouds; 

// createScene function that creates and return the scene
var createScene = function () {
    // create a basic BJS Scene object
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    // create a FreeCamera, and set its position to (x:6, y:5, z:-10)
    camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(5, 5, 60), scene)

    // target the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // attach the camera to the canvas
    camera.attachControl(canvas, false);

    // create a basic light
    var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(5, 2, 0), scene);
    light.intensity = 0.3; 
    light.diffuse = new BABYLON.Color3(5, 5, 5); 
    //var light = new BABYLON.PointLight("sun", new BABYLON.Vector3(200, 100, 50), scene);

    // Call skybox function
    //createSkybox();

    // Earth Sphere
    earth = BABYLON.Mesh.CreateSphere("earth", 50, 50, scene);

    // Transparent sphere
    clouds = BABYLON.Mesh.CreateSphere("clouds", 50.5, 50.5, scene);

    // outersphere
    //var outersphere = BABYLON.Mesh.CreateSphere("outersphere", 51, 51, scene); 

    // Earth Texture
    var earthTexture = new BABYLON.StandardMaterial("earthTexture", scene);
    earthTexture.diffuseTexture = new BABYLON.Texture("/img/earthNasa2.jpg", scene);
    earthTexture.diffuseColor = new BABYLON.Color3(100, 100, 100); 
    earthTexture.bumpTexture = new BABYLON.Texture("/img/map2.jpg", scene);
    earthTexture.specularTexture = new BABYLON.Texture("/img/specularMap.jpg", scene); 
    earth.material = earthTexture;

    // Cloud Texture
    var cloudMaterial = new BABYLON.StandardMaterial("cloudMaterial", scene);
    //cloudMaterial.diffuseTexture = new BABYLON.Texture("/img/earthcloudmap.jpg", scene);
    cloudMaterial.diffuseTexture = new BABYLON.Texture("/img/cloud_fromNasa.jpg", scene); 
    cloudMaterial.specularPower = 25; 
    cloudMaterial.alpha = 0.5;
    clouds.material = cloudMaterial; 

    // outerphere texture
    //var outerMaterial = new BABYLON.StandardMaterial("outerMaterial", scene);
    //outerMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.48, 1);
    //outerMaterial.specularPower = 150;
    //outerMaterial.alpha = 0.3;
    //outersphere.material = outerMaterial; 


    // Create specific number of tiles
    for (i = 0; i < 10; i++)
    {
        var p = ((Math.random() * 20) + 1)

        var astroid = BABYLON.Mesh.CreateBox("box", 1, scene);
        astroid.position = new BABYLON.Vector3(25, 10, p);

    }



    // return the created scene
    return scene;
}

var createSkybox = function () {
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/sky/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
}


// call the createScene function
scene = createScene();

engine.runRenderLoop(function () {
    //astroid.rotation.y += 0.005;
    clouds.rotation.y -= 0.00015;
    clouds.rotation.z -= 0.00015
    earth.rotation.y -= 0.00015; 
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
})