window.$ = window.jQuery = require('jquery')

import { Vector3, WebGLRenderer, Scene, PerspectiveCamera, GridHelper, TextureLoader, Mesh, MeshBasicMaterial, BoxGeometry, MeshPhysicalMaterial, AmbientLight, DirectionalLight, Box3, FontLoader, TextGeometry, AnimationClip, FileLoader, AnimationMixer, AnimationUtils, Clock, KeyframeTrack } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import CapsuleGeometry from '/js/CapsuleGeometry.js'

import Student from '/js/Student.js'

let scene

let idleMixer
let walkingMixer

let clock = new Clock();

let mtlLoader = new MTLLoader()
let fbxLoader = new FBXLoader()
let objLoader = new OBJLoader()
let objLoader2 = new OBJLoader2()
let colladaLoader = new ColladaLoader()

let fontLoader = new FontLoader()

let texture = new TextureLoader().load( 'models/classroom_texture.png' )
let classroom_material = new MeshPhysicalMaterial( { map: texture, clearcoat: 0.2, clearcoatRound: 0.1, color: 0xffffff } )

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
  student.socket.on('movement', function(name, location, theta, isWalking, socketId) {
    if(student.socketId != socketId) {
      if(otherStudents.hasOwnProperty(socketId)) {
        if(otherStudents[socketId].location != undefined) {
          otherStudents[socketId].location = location

          if(isWalking) {
            otherStudents[socketId].geometry.position.y = -100
            otherStudents[socketId].walkingGeometry.position.y = 0
          }
          else {
            otherStudents[socketId].geometry.position.y = 0
            otherStudents[socketId].walkingGeometry.position.y = -100
          }

          otherStudents[socketId].geometry.position.x = location.x
          otherStudents[socketId].geometry.position.z = location.z
          otherStudents[socketId].geometry.rotation.y = theta

          otherStudents[socketId].walkingGeometry.position.x = location.x
          otherStudents[socketId].walkingGeometry.position.z = location.z
          otherStudents[socketId].walkingGeometry.rotation.y = theta

          otherStudents[socketId].textGeometry.position.x = location.x
          otherStudents[socketId].textGeometry.position.z = location.z
        }
      }
      else {
        otherStudents[socketId] = {}

        fbxLoader.load( 'models/idle.fbx', function (idleObject) {
          idleObject.scale.multiplyScalar(0.035)
          let delta = clock.getDelta()
          idleMixer = new AnimationMixer(idleObject)
          let action = idleMixer.clipAction(idleObject.animations[ 0 ])
          action.play()
          let bodyIdleGeometry = idleObject


          fbxLoader.load( 'models/walking.fbx', function (walkingObject) {
            walkingObject.scale.multiplyScalar(0.035)
            let delta = clock.getDelta()
            walkingMixer = new AnimationMixer(walkingObject)
            let action = walkingMixer.clipAction(walkingObject.animations[ 0 ])
            action.play()
            let bodyWalkingGeometry = walkingObject

            fontLoader.load( 'models/helvetiker_regular.typeface.json', function ( font ) {
              let textMaterial = new MeshBasicMaterial ({color: 0xffffff})
              let textGeometry = new TextGeometry(name, {font: font, size: 1, height: 1, curveSegments: 12} )
              let textMesh = new Mesh(textGeometry, textMaterial)
              textMesh.scale.set(1, 1, 0.1)

              let box = new Box3().setFromObject( textMesh )

              otherStudents[socketId] = {name: name, geometry: bodyIdleGeometry, walkingGeometry: bodyWalkingGeometry, textGeometry: textMesh, location: location}

              otherStudents[socketId].geometry.position.x = location.x
              otherStudents[socketId].geometry.position.z = location.z
              otherStudents[socketId].geometry.rotation.y = theta

              otherStudents[socketId].walkingGeometry.position.x = location.x
              otherStudents[socketId].walkingGeometry.position.z = location.z
              otherStudents[socketId].walkingGeometry.rotation.y = theta

              otherStudents[socketId].textGeometry.position.y = student.height + 1
              otherStudents[socketId].textGeometry.position.x = location.x
              otherStudents[socketId].textGeometry.position.z = location.z

              if(isWalking) {
                otherStudents[socketId].geometry.position.y = -100
                otherStudents[socketId].walkingGeometry.position.y = 0
              }
              else {
                otherStudents[socketId].geometry.position.y = 0
                otherStudents[socketId].walkingGeometry.position.y = -100
              }

              scene.add(otherStudents[socketId].geometry)
              scene.add(otherStudents[socketId].walkingGeometry)
              scene.add(otherStudents[socketId].textGeometry)
            })

          })
        })
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
    new AmbientLight(0xffffff, 0.5),
    new DirectionalLight(0xffffff, 1),
    new DirectionalLight(0xffffff, 1),
  ]
  lights[1].position.set(-1, 0.5, 1).normalize()
  lights[2].position.set(1, 0.5, 1).normalize()
  lights.forEach(l => scene.add(l))

  scene.add(student.controls.getObject())

  drawMap()
}

function animate() {
  requestAnimationFrame(animate)
  student.renderer.render(scene, student.camera)
  student.updateMovement()

  let delta = clock.getDelta();

  if ( idleMixer ) idleMixer.update( delta );
  if ( walkingMixer ) walkingMixer.update( delta );


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

  // old classroom:
  // use object loader to add classroom
  // objLoader.load(
  //   '/models/classroom.obj',
  //   function (object) {
  //     object.traverse( function( child ) {
  //       if ( child instanceof Mesh ) {
  //         child.material = classroom_material
  //       }
  //     } )
  //     scene.add(object)
  //   },
  //   function (xhr) {
  //     console.log('classrooom model is ' + (xhr.loaded / xhr.total * 100) + '% loaded')
  //   },
  //   function (error) {
  //     console.log('An error happened')
  //   }
  // )

  colladaLoader.load( '/models/model.dae', function ( object ) {
    let classroom = object.scene
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
