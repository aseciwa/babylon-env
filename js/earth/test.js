/// <reference path="/bjs/dist/babylon.2.2.max.js" />
var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

BABYLON.SceneLoader.Load("", "/scenes/skull.babylon", engine, function (newScene) {
    //BABYLON.SceneLoader.Load(options.babylonFolder + "./GrupoBabylon", options.babylonFile, engine, function (newScene) {  
    newScene.executeWhenReady(function () {
        // Attach camera to canvas inputs
        newScene.activeCamera.attachControl(canvas);
        var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(5, 2, 0), scene);
        // Once the scene is loaded, just register a render loop to render it
        engine.runRenderLoop(function () {
            newScene.render();
        });
    });
}, function (progress) {
    // To do: give progress feedback to user
});
