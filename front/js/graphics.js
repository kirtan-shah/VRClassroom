window.$ = window.jQuery = require('jquery')

import { Vector3, WebGLRenderer, Scene, PerspectiveCamera, GridHelper, TextureLoader, Mesh, MeshBasicMaterial, BoxGeometry, MeshPhysicalMaterial, AmbientLight, DirectionalLight, Box3, FontLoader, TextGeometry, AnimationClip, FileLoader, AnimationMixer, AnimationUtils, Clock, KeyframeTrack, PointLight } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import CapsuleGeometry from '/js/CapsuleGeometry.js'

import Student from '/js/Student.js'

let scene
let mixer

let clock = new Clock();

let mtlLoader = new MTLLoader()
let fbxLoader = new FBXLoader()
let objLoader = new OBJLoader()
let objLoader2 = new OBJLoader2()
let colladaLoader = new ColladaLoader()
let gltfLoader = new GLTFLoader();

let fontLoader = new FontLoader()

let texture = new TextureLoader().load( 'models/classroom_texture.png' )
let student
let otherStudents = {}

$('#landingPage').ready(function() {
  $('#createRoomBtn').click(function() {
    let name = $('#nameInput').val().trim()
    let id = genID()
    student = new Student(name, id, true)
    window.globalSocket = student.socket
    $('#room-id').html('Room Code: ' + id)
    $('#room-id').show()
    $('#dash-button').show()
    startEnvironment()
    $('#app').hide()
  })

  $('#joinRoomForm').on('submit', function(e) {
      e.preventDefault()
      let name = $('#nameInput').val().trim()
      let code = $('#joinRoomInput').val().trim()
      if(code.length == 0) {
        alert('you cannot leave this field empty')
      }
      else {
        student = new Student(name, code, false)
        $('#room-id').html('Room Code: ' + code)
        startEnvironment()
        $('#app').hide()
      }
  })

})

function startEnvironment() {
  createSocketListeners()
  init()
  animate()
}

function createSocketListeners() {
  student.socket.on('movement', function(name, location, theta, state, socketId) {
    if(student.socketId != socketId) {
      if(otherStudents.hasOwnProperty(socketId)) {
        if(otherStudents[socketId].location != undefined) {
          otherStudents[socketId].location = location

          otherStudents[socketId].geometry.position.x = location.x
          otherStudents[socketId].geometry.position.z = location.z
          otherStudents[socketId].geometry.rotation.y = theta

          otherStudents[socketId].textGeometry.position.x = location.x
          otherStudents[socketId].textGeometry.position.z = location.z

          if(state == 'Walking' && otherStudents[socketId].state != 'Walking') {
            otherStudents[socketId].walkingAnimation.play()
            otherStudents[socketId].idleAnimation.stop()
            otherStudents[socketId].state = 'Walking'
          }
          else if(state=='Idle' && otherStudents[socketId].state != 'Idle'){
            otherStudents[socketId].idleAnimation.play()
            otherStudents[socketId].walkingAnimation.stop()
            otherStudents[socketId].state = 'Idle'
          }
        }
      }
      else {
        otherStudents[socketId] = {}

        gltfLoader.load(
          'models/Character.glb',
          function(gltf) {
            let model = gltf.scene
            model.scale.set(3.7, 3.7, 3.7)
            mixer = new AnimationMixer(model)
            let fileAnimations = gltf.animations
            let idleAnim = AnimationClip.findByName(fileAnimations, 'Idle');
            let walkingAnim = AnimationClip.findByName(fileAnimations, 'Walking');
            let idle = mixer.clipAction(idleAnim)
            let walking = mixer.clipAction(walkingAnim)
            if(state == 'Walking') {
              walking.play()
            }
            else if(state == 'Idle') {
              idle.play()
            }

            fontLoader.load( 'models/helvetiker_regular.typeface.json', function ( font ) {
              let textMaterial = new MeshBasicMaterial ({color: 0xffffff})
              let textGeometry = new TextGeometry(name, {font: font, size: 1, height: 1, curveSegments: 12} )
              let textMesh = new Mesh(textGeometry, textMaterial)
              textMesh.scale.set(1, 1, 0.1)

              let box = new Box3().setFromObject( textMesh )

              otherStudents[socketId] = {name: name, geometry: model, textGeometry: textMesh, location: location, walkingAnimation: walking, idleAnimation: idle, state: state}

              otherStudents[socketId].geometry.position.x = location.x
              otherStudents[socketId].geometry.position.z = location.z
              otherStudents[socketId].geometry.rotation.y = theta

              otherStudents[socketId].textGeometry.position.y = student.height + 1.3
              otherStudents[socketId].textGeometry.position.x = location.x
              otherStudents[socketId].textGeometry.position.z = location.z

              scene.add(otherStudents[socketId].geometry)
              scene.add(otherStudents[socketId].textGeometry)
            })


          },
          undefined,
          function(error) {
            console.error(error)
          }
        )
      }
    }
  })

  student.socket.on('disconnect', function(socketId) {
    if(otherStudents.hasOwnProperty(socketId)) {
      scene.remove(otherStudents[socketId].geometry)
      scene.remove(otherStudents[socketId].walkingGeometry)
      scene.remove(otherStudents[socketId].textGeometry)
      delete otherStudents[socketId]
    }
  })

}

function init() {
  let container = document.getElementById('canvas-parent')

  container.appendChild(student.renderer.domElement)

  scene = new Scene()

  // User interaction needed for initial pointer lock control sequence
  container.addEventListener('click', function () {
    student.controls.lock()
  }, false)

  let lights = [
    new AmbientLight(0x7f7f7f, 0.5),
    new PointLight(0x7f7f7f, 1, 0),
    new PointLight(0x7f7f7f, 1, 0),
    // new PointLight(0x7f7f7f, 0.5, 0),
    // new PointLight(0x7f7f7f, 0.5, 0),
    new DirectionalLight(0xfffdb5, .5),
  ]
  lights[1].position.set(16, 5, -20)
  lights[2].position.set(16, 5, -40)
  //lights[1].position.set(28, 5, -40)
  //lights[2].position.set(9, 5, -40)
  // lights[3].position.set(28, 5, -20)
  // lights[4].position.set(9, 5, -20)
  lights[3].position.set(1, 0.6, 0).normalize()
  lights.forEach(l => scene.add(l))

  scene.add(student.controls.getObject())

  drawMap()
}

function animate() {
  requestAnimationFrame(animate)
  student.renderer.render(scene, student.camera)
  student.updateMovement()

  scene.traverse((node) => {
    if (node.isMesh) node.material.transparent = false
  })

  scene.traverse( function( object ) {
    object.frustumCulled = false
  } )

  let delta = clock.getDelta();

  if (mixer) { mixer.update( delta ) }

  for (var socketId in otherStudents) {
    if (otherStudents.hasOwnProperty(socketId)) {
      if(otherStudents[socketId].textGeometry != undefined) {
        otherStudents[socketId].textGeometry.lookAt(student.controls.getObject().position)
      }
    }
  }

}

function drawMap() {
  // add grid on xz axis
  let gridXZ = new GridHelper(2000, 50)
  scene.add(gridXZ)

  colladaLoader.load( '/models/s.dae', function ( object ) {
    let classroom = object.scene
    classroom.traverse(child => {
      if(child.material) {
        if(child.material instanceof Array) {
          child.material = child.material.map(m =>
            //clearcoatRough: 0.1,
            new MeshPhysicalMaterial( { map:  m.map, clearcoat: 0.2, color: m.color || 0xffffff } )
          )
        }
        else child.material = new MeshPhysicalMaterial( { map: child.material.map, clearcoat: 0.2, color: child.material.color || 0xffffff } )
      }

    })
    classroom.scale.multiplyScalar(4)
    scene.add(classroom)
  })

}

function genID () {
  return '' + Math.random().toString(36).substr(2, 9)
}


function onWindowResize(){
  if(student != undefined && student.camera != undefined) {
    student.camera.aspect = window.innerWidth / window.innerHeight
    student.camera.updateProjectionMatrix()
    student.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

window.addEventListener('resize', onWindowResize, false)
