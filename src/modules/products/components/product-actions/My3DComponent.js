import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"

const My3DComponent = ({ customText, variantTitle, width = 600, height = 600 }) => {
  const canvasRef = useRef(null)
  const [scene, setScene] = useState(null)
  const [textMesh, setTextMesh] = useState(null)
  const colorMap = {
    Amarillo: "0xFFFF00",
    Negro: "0x000000",
    Celeste: "0x87CEEB",
    Rojo: "0xFF0000",
    Azul: "0x0000FF",
  }

  useEffect(() => {
    const newScene = new THREE.Scene()
    newScene.background = new THREE.Color(0xffffff)
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
    newScene.add(directionalLight)
  
    // Usa las props width y height en lugar de valores hardcodeados
    const camera = new THREE.PerspectiveCamera(75, width / height)
    camera.position.z = -5
    camera.position.y = 1
    camera.lookAt(0, 0, 0)
    newScene.add(camera)
  
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
    })
    // Usa las props width y height en lugar de valores hardcodeados
    renderer.setSize(width, height)
  
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.update()
  
    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(newScene, camera)
    }
  
    animate()
  
    setScene(newScene)
  
    return () => controls.dispose() // Clean up controls on component unmount
  }, [width, height])

  useEffect(() => {
    if (scene) {
      const loader = new GLTFLoader()

      // Cargar el stick
      loader.load("/umbrella-stick.gltf", function (gltf) {
        scene.add(gltf.scene)
      })

      // Cargar la tela
      loader.load("/umbrella-fabric.gltf", function (gltf) {
        // Usa el color por defecto si variantTitle no está definido
        const colorHex = variantTitle
          ? colorMap[variantTitle]
          : colorMap["Amarillo"]
        if (colorHex) {
          gltf.scene.traverse(function (child) {
            if (child.isMesh) {
              child.material.color.setHex(parseInt(colorHex, 16))
            }
          })
        }
        scene.add(gltf.scene)
      })
    }
  }, [scene, variantTitle, colorMap])

  useEffect(() => {
    if (scene) {
      const fontLoader = new FontLoader()
      fontLoader.load(
        "/assets/fonts/OpenSansMedium-Regular.json",
        function (font) {
          // Usa 'Tu texto' por defecto si customText no está definido
          const textToDisplay = customText || "Tu texto"
          const textGeometry = new TextGeometry(textToDisplay, {
            font: font,
            size: 0.1,
            height: 0.001,
            curveSegments: 12,
          })

          if (textMesh) {
            // Si textMesh ya existe, actualizar su geometría
            textMesh.geometry.dispose() // Desechar la geometría antigua
            textMesh.geometry = textGeometry
          } else {
            // Si textMesh no existe, créalo
            const textMaterial = new THREE.MeshBasicMaterial({
              color: 0x000000,
            })
            const newTextMesh = new THREE.Mesh(textGeometry, textMaterial)
            newTextMesh.position.set(1.2, 0.3, -2.1)
            newTextMesh.rotation.y = Math.PI / 1.13
            setTextMesh(newTextMesh)
            scene.add(newTextMesh)
          }
        }
      )
    }
  }, [scene, customText, textMesh])

  

  return (
    <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default My3DComponent
