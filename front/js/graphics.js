import { Vector3, WebGLRenderer, Scene, PerspectiveCamera, GridHelper } from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'


let scene, renderer, camera
let controls

let width = window.innerWidth
let height = window.innerHeight

let moveForward = false
let moveBackward = false
let moveLeft = false
let moveRight = false

let velocity = new Vector3()
let direction = new Vector3()

init()
animate()

function init()
{
    renderer = new WebGLRenderer( {antialias:true} )
    let container = document.getElementById('canvas-parent')

    renderer.setSize (width, height)
    renderer.setClearColor (0xEAEEF1, 1)
    container.appendChild (renderer.domElement)

    scene = new Scene()

    camera = new PerspectiveCamera (45, width/height, 1, 10000)
    camera.position.y = 30
    camera.position.z = 0

    controls = new PointerLockControls( camera, renderer.domElement )

    // User interaction needed for initial pointer lock control sequence
    container.addEventListener( 'click', function () {
      controls.lock()
    }, false )

    scene.add( controls.getObject() )

    drawMap()

    let onKeyDown = function ( event ) {
      switch ( event.keyCode ) {
        case 38: // up
        case 87: // w
          moveForward = true
          break

        case 37: // left
        case 65: // a
          moveLeft = true
          break

        case 40: // down
        case 83: // s
          moveBackward = true
          break

        case 39: // right
        case 68: // d
          moveRight = true
          break
      }
    }

		let onKeyUp = function ( event ) {
      switch ( event.keyCode ) {
        case 38: // up
        case 87: // w
          moveForward = false
          break

        case 37: // left
        case 65: // a
          moveLeft = false
          break

        case 40: // down
        case 83: // s
          moveBackward = false
          break

        case 39: // right
        case 68: // d
          moveRight = false
          break
      }
    }

  document.addEventListener( 'keydown', onKeyDown, false )
  document.addEventListener( 'keyup', onKeyUp, false )
}

function animate()
{
  requestAnimationFrame ( animate )
  renderer.render (scene, camera)

  if ( controls.isLocked === true ) {
    if(moveForward == true)
      direction.z = -1.0
    else if(moveBackward == true){
      direction.z = 1.0
    }
    else if(moveForward == false && moveBackward == false){
      direction.z = 0
    }

    if(moveRight == true)
      direction.x = -1.0
    else if(moveLeft == true){
      direction.x = 1.0
    }
    else if(moveRight == false && moveLeft == false){
      direction.x = 0
    }

    direction.normalize() // this ensures consistent movements in all directions

    velocity.z = direction.z * 2
    velocity.x = direction.x * 2
    velocity.y = direction.y * 2

    controls.moveRight( - velocity.x)
    controls.moveForward( - velocity.z)
    controls.getObject().position.y += (velocity.y)
  }
}

function drawMap() {
  console.log("drawing 3d map")

  let gridXZ = new GridHelper(2000, 50)
  scene.add(gridXZ)
}

window.addEventListener( 'resize', onWindowResize, false )

function onWindowResize(){
  if(camera != undefined) {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth, window.innerHeight)
  }

  width = window.innerWidth
  height = window.innerHeight
}

function scrollToTop() {
  window.scrollTo(0, 0)
}
