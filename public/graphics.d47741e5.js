parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"lcCb":[function(require,module,exports) {
var e,n,i,t,a=window.innerWidth,o=window.innerHeight,r=!1,c=!1,d=!1,s=!1,w=!1,E=!1,k=new THREE.Vector3,l=new THREE.Vector3;function m(){n=new THREE.WebGLRenderer({antialias:!0});var k=document.getElementById("canvas-parent");n.setSize(a,o),n.setClearColor(15396593,1),k.appendChild(n.domElement),e=new THREE.Scene,(i=new THREE.PerspectiveCamera(45,a/o,1,1e4)).position.y=160,i.position.z=400,i.lookAt(new THREE.Vector3(0,0,0)),t=new THREE.PointerLockControls(i,n.domElement),k.addEventListener("click",function(){t.lock()},!1),e.add(t.getObject()),b();document.addEventListener("keydown",function(e){switch(e.keyCode){case 38:case 87:r=!0;break;case 37:case 65:d=!0;break;case 40:case 83:c=!0;break;case 39:case 68:s=!0;break;case 82:w=!0;break;case 70:E=!0}},!1),document.addEventListener("keyup",function(e){switch(e.keyCode){case 38:case 87:r=!1;break;case 37:case 65:d=!1;break;case 40:case 83:c=!1;break;case 39:case 68:s=!1;break;case 82:w=!1;break;case 70:E=!1}},!1)}function u(){requestAnimationFrame(u),n.render(e,i),!0===t.isLocked&&(1==r?l.z=-1:1==c?l.z=1:0==r&&0==c&&(l.z=0),1==s?l.x=-1:1==d?l.x=1:0==s&&0==d&&(l.x=0),1==w?l.y=1:1==E?l.y=-1:0==w&&0==E&&(l.y=0),l.normalize(),k.z=2*l.z,k.x=2*l.x,k.y=2*l.y,t.moveRight(-k.x),t.moveForward(-k.z),t.getObject().position.y+=k.y)}function b(){console.log("drawing 3d map");var n=new THREE.GridHelper(2e3,50);e.add(n)}function y(){null!=i&&(i.aspect=window.innerWidth/window.innerHeight,i.updateProjectionMatrix(),n.setSize(window.innerWidth,window.innerHeight)),a=window.innerWidth,o=window.innerHeight}function H(){window.scrollTo(0,0)}m(),u(),window.addEventListener("resize",y,!1);
},{}]},{},["lcCb"], null)
//# sourceMappingURL=/graphics.d47741e5.js.map