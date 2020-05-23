import { Vector3, WebGLRenderer, Scene, PerspectiveCamera, GridHelper, TextureLoader, Mesh, MeshBasicMaterial } from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

import Student from '/js/Student.js'

let scene, controls

let objLoader = new OBJLoader()

let texture = new TextureLoader().load( 'models/classroom_texture.png' );
let classroom_material = new MeshBasicMaterial( { map: texture } );

let student = new Student('kirtan')

init()
animate()

function init()
{
  let container = document.getElementById('canvas-parent')

  container.appendChild(student.renderer.domElement)

  scene = new Scene()

  // User interaction needed for initial pointer lock control sequence
  container.addEventListener('click', function () {
    student.controls.lock()
  }, false)

  scene.add(student.controls.getObject())

  drawMap()
}

function animate()
{
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
      console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    },
    function (error) {
      console.log('An error happened')
    }
 )
}

function onWindowResize(){
  if(student.camera != undefined) {
    student.camera.aspect = window.innerWidth / window.innerHeight
    student.camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

window.addEventListener('resize', onWindowResize, false)
