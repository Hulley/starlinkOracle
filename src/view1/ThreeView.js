import React, { useState, Suspense, useEffect, useRef } from 'react'
import '../App.css'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { addEffect } from 'react-three-fiber'
import Stars from './3d/Stars'
import Locator from './Locator'

function ThreeView() {
  // vars
  const startTime = Date.now();
  const loopTime = 40 * 1000; // 40 seconds
  const viewNavModes = {
    1: 'accelerometer',
    2: 'drag'
  };
  // Degree to Radian conversion
  const degToRad = Math.PI / 180;
  const radToDeg = 180 / Math.PI;
  // state
  // let accel = useMotion();
  const [ viewNavMode, setViewMode ] = useState(viewNavModes[1]);
  const [ isDragging, setIsDragging ] = useState(false);
  const [ clock, setClock ] = useState(new THREE.Clock(false));
  const [ t, setT ] = useState(0);
  const [ cameraViewAngle, setCameraViewAngle ] = useState(new THREE.Euler(90*degToRad,0,0,'YZX'));
  const [ cameraRef, setCameraRef ] = useState({});
  // helper state values
  const [ clickObjPos, setClickObjPos ] = useState([3,20,2]);
  // actions
  const actions = {};
  actions.init = (camera) => {
    camera.setRotationFromEuler(cameraViewAngle);
    setCameraRef({camera});
    setClock(clock.start());
    addEffect(()=>{
      const time = Date.now()
      setT(((time - startTime) % loopTime) / loopTime);
    })
  }
  actions.updateMouse = ({ clientX: x, clientY: y, target }) => {
    if( isDragging ){ // 'drag'
      // place ref obj at click - 20 units from camera - camera at [0,0,0]
      let vector = new THREE.Vector3();
      let axisX = (x/target.width) * 2 - 1;
      let axisY = (-y/target.height) * 2 + 1;
      vector.set(axisX,axisY,0);
      vector.unproject(cameraRef.camera);
      vector.normalize();
      vector.multiplyScalar(20);
      setClickObjPos(vector);
      setIsDragging(true);
    }
  }
  actions.mouseClick = ({clientX: x, clientY: y, target}) => {
    // place ref obj at click - 20 units from camera - camera at [0,0,0]
    let vector = new THREE.Vector3();
    let axisX = (x/target.width) * 2 - 1;
    let axisY = (-y/target.height) * 2 + 1;
    vector.set(axisX,axisY,0);
    vector.unproject(cameraRef.camera);
    vector.normalize();
    vector.multiplyScalar(20);
    setClickObjPos(vector);
    setIsDragging(true);
  }
  function handleOrientationEvent (event) {
      // do something amazing
      let x = event.alpha * degToRad;
      let y = event.beta * degToRad;
      let z = event.gamma * degToRad;
      if(viewNavMode === viewNavModes[1]){ // 'accelerometer'
        // console.log(event);
        // console.log(cameraRef.camera);
        cameraRef.camera.setRotationFromEuler(new THREE.Euler(y,z,x,'YZX'));
      }
  };
  useEffect(()=>{
    window.addEventListener("deviceorientation", handleOrientationEvent, true);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientationEvent, true);
    }
  })

  return (
    <div className="App">
      <header className="App-header">
        <Canvas
          style={{height: "100vh", width: "100vw", flex: 1}}
          concurrent
          onPointerMove={actions.updateMouse}
          onPointerDown={actions.mouseClick}
          onPointerUp={()=>{setIsDragging(false)}}
          camera={{ 
            position: [0, 0, 0], 
            near: 0.01, 
            far: 10000, 
            fov: 70
          }}
          onCreated={({ gl, camera }) => {
            actions.init(camera);
          }}
          >
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[0,20,0]} />
          <Box position={clickObjPos} color="indianred" />
          <Earth />
          <Stars />
        </Canvas>
        <Locator style={{textAlign: 'right', right: '2rem', bottom: '2rem'}} />
      </header>
    </div>
  )
}

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))
  
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={[1, 1, 1]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={props.color ? props.color : 'orange'} />
    </mesh>
  )
}

function Earth(props) {
   // This reference will give us direct access to the mesh
   const mesh = useRef()

   return (
     <mesh
       {...props}
       ref={mesh}
       position={[0,0,-1.5]}
       scale={[1000,1000,0]}
       >
       <circleBufferGeometry attach="geometry" args={[1,64]} />
       <meshBasicMaterial attach="material" opacity={0.3} transparent={true} color={'green'} side={THREE.DoubleSide}/>
     </mesh>
   )
}

function Camera(props) {
  const ref = useRef()
  const { setDefaultCamera } = useThree()
  // Make the camera known to the system
  useEffect(() => void setDefaultCamera(ref.current))
  // Update it every frame
  useFrame(() => ref.current.updateMatrixWorld())
  return <perspectiveCamera ref={ref} {...props} />
}

export default ThreeView;