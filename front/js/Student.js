import { Vector3, PerspectiveCamera, WebGLRenderer } from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import IO from 'socket.io-client'

export default class Student {

  constructor(name) {
    this.name = name
    this.id = 'some_id'

    this.movementSpeed = 0.2
    this.height = 5.5
    this.startX = -15.18
    this.startZ = -13.88
    this.lookAtInitial = new Vector3(0, this.height, 0)

    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false

    this.velocity = new Vector3()
    this.direction = new Vector3()

    this.camera = new PerspectiveCamera (45, window.innerWidth/window.innerHeight, 1, 10000)
    this.camera.position.y = this.height
    this.camera.position.x = this.startX
    this.camera.position.z = this.startZ
    this.camera.lookAt(this.lookAtInitial)

    this.renderer = new WebGLRenderer({antialias:true})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0xEAEEF1, 1)

    this.controls = new PointerLockControls(this.camera, this.renderer.domElement)

    this.socket = IO()
    this.socketRoom = 'classroom1'

    this.socket.on('connect', () => {
      this.socketId = this.socket.id
      this.socket.emit('joinRoom', this.socketRoom)
    })

    this.socket.on('studentConnected', () => {
      this.socket.emit('updateMovement', this.controls.getObject().position, this.socketRoom)
    })

    this.initKeyDown(this)
    this.initKeyUp(this)
  }

  initKeyDown(student) {
    let onKeyDown = function (event) {
      switch (event.keyCode) {
        case 38: // up
        case 87: // w
          student.moveForward = true
          break

        case 37: // left
        case 65: // a
          student.moveLeft = true
          break

        case 40: // down
        case 83: // s
          student.moveBackward = true
          break

        case 39: // right
        case 68: // d
          student.moveRight = true
          break
      }
    }

    document.addEventListener('keydown', onKeyDown, false)
  }

  initKeyUp(student) {
    let onKeyUp = function (event) {
      switch (event.keyCode) {
        case 38: // up
        case 87: // w
          student.moveForward = false
          break

        case 37: // left
        case 65: // a
          student.moveLeft = false
          break

        case 40: // down
        case 83: // s
          student.moveBackward = false
          break

        case 39: // right
        case 68: // d
          student.moveRight = false
          break
      }
    }

    document.addEventListener('keyup', onKeyUp, false)
  }

  updateMovement() {
    if (this.controls.isLocked === true) {
      if(this.moveForward == true)
        this.direction.z = -1.0
      else if(this.moveBackward == true){
        this.direction.z = 1.0
      }
      else if(this.moveForward == false && this.moveBackward == false){
        this.direction.z = 0
      }

      if(this.moveRight == true)
        this.direction.x = -1.0
      else if(this.moveLeft == true){
        this.direction.x = 1.0
      }
      else if(this.moveRight == false && this.moveLeft == false){
        this.direction.x = 0
      }

      this.direction.normalize() // this ensures consistent movements in all directions

      this.velocity.z = this.direction.z * this.movementSpeed
      this.velocity.x = this.direction.x * this.movementSpeed
      this.velocity.y = this.direction.y * this.movementSpeed

      if(this.direction.length() != 0) {
        this.socket.emit('updateMovement', this.controls.getObject().position, this.socketRoom)
      }

      this.controls.moveRight(- this.velocity.x)
      this.controls.moveForward(- this.velocity.z)
      this.controls.getObject().position.y += (this.velocity.y)
    }
  }

}
