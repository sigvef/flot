
var renderer = new THREE.WebGLRenderer({alpha: true});
var width = 1600;
var height = 900;
renderer.setSize(1600, 900);
document.body.appendChild(renderer.domElement);
var camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, -500, 1000);
var scene = new THREE.Scene();
scene.add(camera);


document.getElementById('slider').addEventListener('input', function(e) {
  console.log(e.target.value);
  document.getElementById('framenumber').innerText = e.target.value;
  document.getElementById('time').innerText = e.target.value / 60;
  syncrender(e.target.value / 60);
});


function lerp(a, b, t) {
  return a + t * (b - a);
}


function getValue(keyframes, time) {
  var nearestAbove = 1e99;
  var nearestBelow = -1e99;
  for(var keyframe in keyframes) {
    if(+keyframe >= time && +keyframe < nearestAbove) {
      nearestAbove = keyframe;
    }

    if(+keyframe <= time && +keyframe > nearestBelow) {
      nearestBelow = keyframe;
    }
  }
  if(nearestAbove == 1e99) {
    nearestAbove = nearestBelow;
  }
  if(nearestBelow == -1e99) {
    nearestBelow = nearestAbove;
  }

  var from = keyframes[nearestBelow];
  var to = keyframes[nearestAbove];
  var values = [];
  var t = (time - nearestBelow) / (nearestAbove - nearestBelow);
  if(t == Infinity) {
    t = 1;
  }
  for(var i = 0; i < from.value.length; i++) {
    values[i] = lerp(from.value[i], to.value[i], t);
  }
  return values;
}

for(var key in testlayer.Contents) {
  var rectangle = testlayer.Contents[key];
  var geometry = new THREE.BoxGeometry(rectangle.Contents.Size[0], rectangle.Contents.Size[1], 1);
  var material = new THREE.MeshBasicMaterial({color: 0x79BD8F});
  var mesh = new THREE.Mesh(geometry, material);
  rectangle.mesh = mesh;
  scene.add(mesh);
}


function syncrender(time) {
    for(var key in testlayer.Contents) {
      var rectangle = testlayer.Contents[key];
      var position = getValue(rectangle.Transform.Position, time);
      console.log('position', position[0], position[1]);
      rectangle.mesh.position.x = position[0];
      rectangle.mesh.position.y = position[1];
      var scale = getValue(rectangle.Transform.Scale, time);
      rectangle.mesh.scale.x = scale[0] / 100;
      rectangle.mesh.scale.y = scale[1] / 100;
      console.log('scale', scale[0] / 100, scale[1] / 100);
      var rotation = getValue(rectangle.Transform.Rotation, time);
      rectangle.mesh.rotation.z = rotation[0];
      console.log('rotation', rotation[0]);
  }
  renderer.render(scene, camera);
}


syncrender(81.2);
