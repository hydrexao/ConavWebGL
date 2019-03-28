Arena = function(game) //on créée notre objet Arena qui prend l'objet game en argument
{
    // VARIABLES UTILES
    this.game = game;
    var scene = game.scene;

    // LUMIERES 

    /*TODO :  -3 lumières différentes
              -couleurs et intensités
    */
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.diffuse = new BABYLON.Color3(0.4, 0.4, 0.4);
    light.specular = new BABYLON.Color3(0.4, 0.4, 0.4);
    var light2 = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(50, 50, 50), new BABYLON.Vector3(-1, -1, -1), Math.PI / 2, 2, scene);
    light2.diffuse = new BABYLON.Color3(1, 0, 0);
    light2.specular = new BABYLON.Color3(1, 0.3, 0);
    var light3 = new BABYLON.PointLight("pointlight", new BABYLON.Vector3(-20, 0, 30), scene);
    light.diffuse = new BABYLON.Color3(0, 0.5, 0.5);
    light.specular = new BABYLON.Color3(0, 0.7, 0);

    // MATERIAUX ET TEXTURES

    /*TODO :    -materiau standard
                -multi-materiaux
                -video-texture
                -normal map
                -texture procedurale (feu, nuage...)
    */
    var material = new BABYLON.StandardMaterial("groundTexture", scene);
    material.diffuseColor = new BABYLON.Color3(0.5, 0.6, 0.7);
    material.specularColor = new BABYLON.Color3(1, 0.6, 0.87);
    material.emissiveColor = new BABYLON.Color3(0, 0, 0);
    material.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

    var materialPlank = new BABYLON.StandardMaterial("mat2", scene); 
    materialPlank.diffuseTexture =  new BABYLON.Texture("textures/plank/color.png", scene);
    materialPlank.bumpTexture = new BABYLON.Texture("textures/plank/normal.png", scene);

    var bleu = new BABYLON.StandardMaterial("bleu", scene); 
    bleu.diffuseColor = new BABYLON.Color3.Blue();

    var blanc = new BABYLON.StandardMaterial("blanc", scene); 
    bleu.diffuseColor = new BABYLON.Color3.White();

    var rouge = new BABYLON.StandardMaterial("rouge", scene); 
    bleu.diffuseColor = new BABYLON.Color3.Red();

    var materialSphere = new BABYLON.MultiMaterial("multi", scene);
    materialSphere.subMaterials.push(rouge, blanc, bleu);

    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/nissi", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);


    //MESHS ET COLLISIONS

    /*TODO :    -box
                -sphere
                -cylindre
                -tore
                -appliquer les collisions
    */
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {height: 100, width: 100, subdivisions: 4}, scene);
    ground.material = material;
    ground.position.y = 0;
    ground.checkCollisions=true;

    var cube = BABYLON.Mesh.CreateBox("cube", 10, scene, false);
    this.game.scene.cube = cube;// va nous permettre d'accéder à notre mesh pour réaliser des animations au sein du prototype 
    //(à faire à chaque fois que vous comptez animer un mesh)
    cube.position = new BABYLON.Vector3(0, 5, 0);
    cube.material = materialPlank;
    cube.checkCollisions=true;

    var cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height : 25}, scene);
    cylinder.position.y = 22.5;
    cylinder.checkCollisions = true;

    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter : 5}, scene);
    sphere.position = new BABYLON.Vector3(0, 37.5, 0);
    var TotalIndices = sphere.getTotalIndices();
    var TotalVertices = sphere.getTotalVertices();
    sphere.subMeshes = [];
    sphere.subMeshes.push(new BABYLON.SubMesh(0,0,TotalVertices,0,TotalIndices/3,sphere));
    sphere.subMeshes.push(new BABYLON.SubMesh(1,0,TotalVertices,TotalIndices/3,TotalIndices/3,sphere));
    sphere.subMeshes.push(new BABYLON.SubMesh(2,0,TotalVertices,TotalIndices/3*2,TotalIndices/3,sphere));
    sphere.material = materialSphere;
    this.game.scene.sphere = sphere;
    // ne fait pas vraiment ce qui est prévu, la partie blanche est invisible et celle en rouge à moitié transparente

    var ecran = BABYLON.MeshBuilder.CreatePlane("plane", {width: 10, height : 10}, scene);
    ecran.position = new BABYLON.Vector3(0, 5, -5.01);
    ecran.material = new BABYLON.StandardMaterial("videoTexture", scene);
    ecran.material.diffuseTexture = new BABYLON.VideoTexture("video",["textures/welcome.mp4", "textures/welcome.webm"], scene, true);
    ecran.material.emissiveColor = new BABYLON.Color3(1,1,1);

    var torus = BABYLON.MeshBuilder.CreateTorus("torus", {diameter:6, thickness: 0.8}, scene);
    torus.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0,0,1), Math.PI/2);
    torus.position = new BABYLON.Vector3(0, 37.5, 0);

    var ascenseur = BABYLON.MeshBuilder.CreateBox("ascenseur", {height: 0.2, width: 10, depth: 4}, scene);
    ascenseur.position = new BABYLON.Vector3(0,0.1,7);
    this.game.scene.ascenseur = ascenseur;
    ascenseur.checkCollisions = true;



    //AUDIO

    /*TODO : -sons d'ambiance
              -sons liés à des objets --> le son doit être localisé spatialement
    */

    var piano = new BABYLON.Sound("piano", "sounds/TenderRemains.mp3", scene, null, { loop: true, autoplay: true });
    piano.setVolume(0.5);
    var welcome = new BABYLON.Sound("welcome", "sounds/Welcome.mp3",scene, null, { loop: true, autoplay: true, spatialSound: true });
    welcome.setDirectionalCone(90,150,0);
    welcome.setLocalDirectionToMesh(new BABYLON.Vector3(0, 0, -1));
    welcome.attachToMesh(ecran);
    
    //SKYBOX

    /*TODO : -Créer une (grande) box
             -Un materiau avec une CubeTexture, attention à bien faire correspodre les faces.
    */
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
    skybox.material = skyboxMaterial;
};

var sens = 0.0001;
var rota = 0;

Arena.prototype={

    //ANIMATION
    _animateWorld : function(ratioFps)
    {
      // Animation des plateformes (translation, rotation, redimensionnement ...)
      /*TODO*/
    scene = this.game.scene;
    ascenseur = scene.ascenseur;
    sphere = scene.sphere;
    scene.registerBeforeRender(function () {
        if(ascenseur.position.y >= 9.9 && sens>0) {sens = -0.0001/ratioFps;}
        if(ascenseur.position.y <=0.1 && sens <0) {sens = 0.0001/ratioFps;}
        ascenseur.position.y += sens;

        sphere.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0,1,0), rota);
        rota+=0.1/ratioFps;
    });

    



    },
}