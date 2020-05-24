window.$ = window.jQuery = require('jquery')

import { Vector3, WebGLRenderer, Scene, PerspectiveCamera, GridHelper, TextureLoader, Mesh, MeshBasicMaterial, BoxGeometry, MeshPhysicalMaterial, AmbientLight, DirectionalLight } from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import CapsuleGeometry from '/js/CapsuleGeometry.js'

import Student from '/js/Student.js'

let scene
let objLoader = new OBJLoader()

let texture = new TextureLoader().load( 'models/classroom_texture.png' );
let classroom_material = new MeshPhysicalMaterial( { map: texture, clearcoat: 0.2, clearcoatRound: 0.1, color: 0xffffff } );

let student
let otherStudents = {}

$('#landingPage').ready(function() {

  $('#createRoomBtn').click(function() {
    let id = genID()
    student = new Student('kirtan teacher', id, true)
    $('#room-id').html('Room Code: ' + id)
    $('#room-id').show()
    $('#dash-button').show()
    startEnvironment()
    $('#app').hide()
  })

  $('#joinRoomForm').on('submit', function(e) {
      e.preventDefault()
      let input = $('#joinRoomInput').val().trim()
      if(input.length == 0) {
        alert('you cannot leave this field empty')
      }
      else {
        student = new Student('kirtan student', input, false)
        $('#room-id').html('Room Code: ' + input)
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
  student.socket.on('movement', function(location, socketId) {
    if(student.socketId != socketId) {
      if(otherStudents.hasOwnProperty(socketId)) {
        otherStudents[socketId].location = location
      }
      else {
        let material = new MeshBasicMaterial ({color: 0xd62e50})
        let geometry = new CapsuleGeometry(1, student.height-1-1, 32)
        let mesh = new Mesh (geometry, material)
        mesh.rotation.x = Math.PI/2

        otherStudents[socketId] = {geometry: mesh, location: location}
        otherStudents[socketId].geometry.position.y = student.height - student.height/2

        scene.add(otherStudents[socketId].geometry)
      }

      otherStudents[socketId].geometry.position.x = location.x
      otherStudents[socketId].geometry.position.z = location.z
    }
  })

  student.socket.on('disconnect', function(socketId) {
    if(otherStudents.hasOwnProperty(socketId)) {
      scene.remove(otherStudents[socketId].geometry)
      otherStudents.delete(socketId)
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
}

function drawMap() {
  // add grid on xz axis
  let gridXZ = new GridHelper(2000, 50)
  scene.add(gridXZ)

  // use object loader to add classroom
  objLoader.load(
    '/models/classroom.obj',
    function (object) {
      object.traverse( function( child ) {
        if ( child instanceof Mesh ) {
          child.material = classroom_material
        }
      } )
      scene.add(object)
    },
    function (xhr) {
      console.log('classrooom model is ' + (xhr.loaded / xhr.total * 100) + '% loaded')
    },
    function (error) {
      console.log('An error happened')
    }
 )
}

function genID () {
  return '' + Math.random().toString(36).substr(2, 9);
}


function onWindowResize(){
  if(student.camera != undefined) {
    student.camera.aspect = window.innerWidth / window.innerHeight
    student.camera.updateProjectionMatrix()
    student.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

window.addEventListener('resize', onWindowResize, false)
