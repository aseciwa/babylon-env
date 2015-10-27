/// <reference path="/bjs/dist/babylon.2.2.js" />

var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(20, 20, 0), scene);
    camera.setPosition(new BABYLON.Vector3(100, 50, -75));

    camera.lowerBetaLimit = 1;  //0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.999;
    camera.lowerRadiusLimit = 150;

    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    // Light
    //var light = new BABYLON.PointLight("omni", new BABYLON.Vector3(50, 50, 50), scene);;
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

    // ground mesh and heightmap
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("/img/texture2.jpg", scene);

    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "/img/mountain2.png", 200, 200, 100, 0, 20, scene, false);
    ground.material = groundMaterial;
    ground.checkCollisions = true;

    // Meshes
    var blueBox = BABYLON.Mesh.CreateBox("blue", 5, scene);
    var blueMat = new BABYLON.StandardMaterial("ground", scene);
    blueMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    blueMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    blueMat.emissiveColor = BABYLON.Color3.Blue();
    blueBox.material = blueMat;
    blueBox.position.x += 50;
    blueBox.position.y = 2.5;

    var Box = BABYLON.Mesh.CreateBox("box", 5, scene);
    var Mat = new BABYLON.StandardMaterial("ground", scene);
    Mat.diffuseColor = new BABYLON.Color3(1.4, 1.4, 1.4);
    Mat.specularColor = new BABYLON.Color3(1.4, 1.4, 1.4);
    Mat.emissiveColor = BABYLON.Color3.Blue();
    Box.material = Mat;
    Box.position.x += 20;
    Box.position.y = 2.5;

    // Events
    var canvas = engine.getRenderingCanvas();
    var startingPoint;
    var currentMesh;

    var getGroundPosition = function () {
        // Use a predicate to get position on the ground
        var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }

        return null;
    }

    var onPointerDown = function (evt) {
        if (evt.button !== 0) {
            return;
        }

        // check if we are under a mesh
        var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
        if (pickInfo.hit) {
            currentMesh = pickInfo.pickedMesh;
            startingPoint = getGroundPosition(evt);

            if (startingPoint) { // we need to disconnect camera from canvas
                setTimeout(function () {
                    camera.detachControl(canvas);
                }, 0);
            }
        }
    }

    var onPointerUp = function () {
        if (startingPoint) {
            camera.attachControl(canvas, true);
            startingPoint = null;
            return;
        }
    }

    var onPointerMove = function (evt) {
        if (!startingPoint) {
            return;
        }

        var current = getGroundPosition(evt);

        if (!current) {
            return;
        }

        var diff = current.subtract(startingPoint);
        currentMesh.position.addInPlace(diff);

        startingPoint = current;

    }

    canvas.addEventListener("pointerdown", onPointerDown, false);
    canvas.addEventListener("pointerup", onPointerUp, false);
    canvas.addEventListener("pointermove", onPointerMove, false);

    scene.onDispose = function () {
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointermove", onPointerMove);
    }

    return scene;
};

var scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});