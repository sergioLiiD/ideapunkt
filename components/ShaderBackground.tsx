'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Vertex shader - exactamente como en el ejemplo
const vertexShader = `
  //
  // GLSL textureless classic 3D noise "cnoise",
  // with an RSL-style periodic variant "pnoise".
  // Author:  Stefan Gustavson (stefan.gustavson@liu.se)
  // Version: 2011-10-11
  //
  // Many thanks to Ian McEwan of Ashima Arts for the
  // ideas for permutation and gradient selection.
  //
  // Copyright (c) 2011 Stefan Gustavson. All rights reserved.
  // Distributed under the MIT license. See LICENSE file.
  // https://github.com/ashima/webgl-noise
  //

  vec3 mod289(vec3 x)
  {
   return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x)
  {
   return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x)
  {
   return mod289(((x*34.0)+1.0)*x);
  }

  vec4 taylorInvSqrt(vec4 r)
  {
   return 1.79284291400159 - 0.85373472095314 * r;
  }

  vec3 fade(vec3 t) {
   return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  // Classic Perlin noise
  float cnoise(vec3 P)
  {
   vec3 Pi0 = floor(P); // Integer part for indexing
   vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
   Pi0 = mod289(Pi0);
   Pi1 = mod289(Pi1);
   vec3 Pf0 = fract(P); // Fractional part for interpolation
   vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
   vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
   vec4 iy = vec4(Pi0.yy, Pi1.yy);
   vec4 iz0 = Pi0.zzzz;
   vec4 iz1 = Pi1.zzzz;

   vec4 ixy = permute(permute(ix) + iy);
   vec4 ixy0 = permute(ixy + iz0);
   vec4 ixy1 = permute(ixy + iz1);

   vec4 gx0 = ixy0 * (1.0 / 7.0);
   vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
   gx0 = fract(gx0);
   vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
   vec4 sz0 = step(gz0, vec4(0.0));
   gx0 -= sz0 * (step(0.0, gx0) - 0.5);
   gy0 -= sz0 * (step(0.0, gy0) - 0.5);

   vec4 gx1 = ixy1 * (1.0 / 7.0);
   vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
   gx1 = fract(gx1);
   vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
   vec4 sz1 = step(gz1, vec4(0.0));
   gx1 -= sz1 * (step(0.0, gx1) - 0.5);
   gy1 -= sz1 * (step(0.0, gy1) - 0.5);

   vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
   vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
   vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
   vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
   vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
   vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
   vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
   vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

   vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
   g000 *= norm0.x;
   g010 *= norm0.y;
   g100 *= norm0.z;
   g110 *= norm0.w;
   vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
   g001 *= norm1.x;
   g011 *= norm1.y;
   g101 *= norm1.z;
   g111 *= norm1.w;

   float n000 = dot(g000, Pf0);
   float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
   float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
   float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
   float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
   float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
   float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
   float n111 = dot(g111, Pf1);

   vec3 fade_xyz = fade(Pf0);
   vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
   vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
   float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
   return 2.2 * n_xyz;
  }

  // Classic Perlin noise, periodic variant
  float pnoise(vec3 P, vec3 rep)
  {
   vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
   vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
   Pi0 = mod289(Pi0);
   Pi1 = mod289(Pi1);
   vec3 Pf0 = fract(P); // Fractional part for interpolation
   vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
   vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
   vec4 iy = vec4(Pi0.yy, Pi1.yy);
   vec4 iz0 = Pi0.zzzz;
   vec4 iz1 = Pi1.zzzz;

   vec4 ixy = permute(permute(ix) + iy);
   vec4 ixy0 = permute(ixy + iz0);
   vec4 ixy1 = permute(ixy + iz1);

   vec4 gx0 = ixy0 * (1.0 / 7.0);
   vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
   gx0 = fract(gx0);
   vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
   vec4 sz0 = step(gz0, vec4(0.0));
   gx0 -= sz0 * (step(0.0, gx0) - 0.5);
   gy0 -= sz0 * (step(0.0, gy0) - 0.5);

   vec4 gx1 = ixy1 * (1.0 / 7.0);
   vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
   gx1 = fract(gx1);
   vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
   vec4 sz1 = step(gz1, vec4(0.0));
   gx1 -= sz1 * (step(0.0, gx1) - 0.5);
   gy1 -= sz1 * (step(0.0, gy1) - 0.5);

   vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
   vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
   vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
   vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
   vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
   vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
   vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
   vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

   vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
   g000 *= norm0.x;
   g010 *= norm0.y;
   g100 *= norm0.z;
   g110 *= norm0.w;
   vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
   g001 *= norm1.x;
   g011 *= norm1.y;
   g101 *= norm1.z;
   g111 *= norm1.w;

   float n000 = dot(g000, Pf0);
   float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
   float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
   float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
   float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
   float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
   float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
   float n111 = dot(g111, Pf1);

   vec3 fade_xyz = fade(Pf0);
   vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
   vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
   float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
   return 1.5 * n_xyz;
  }

  // Turbulence By Jaume Sanchez => https://codepen.io/spite/

  varying vec2 vUv;
  varying float noise;
  varying float qnoise;
  varying float displacement;

  uniform float time;
  uniform float pointscale;
  uniform float decay;
  uniform float complex;
  uniform float waves;
  uniform float eqcolor;
  uniform bool fragment;
  uniform float speedMultiplier; // Multiplicador de velocidad
  uniform float displacementAmplitude; // Amplitud del desplazamiento (para efecto soundwave)
  uniform float directionalMultiplier; // Multiplicador para el desplazamiento direccional (0.0 = solo normal, 1.0 = más direccional)

  float turbulence( vec3 p) {
   float t = - 0.1;
   for (float f = 1.0 ; f <= 3.0 ; f++ ){
     float power = pow( 2.0, f );
     t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
   }
   return t;
  }

  void main() {

   vUv = uv;

   // Aplicar multiplicador de velocidad al tiempo
   float adjustedTime = time * speedMultiplier;
   
   // Usar waves y eqcolor directamente (ya vienen con los valores correctos según el estado)
   noise = (1.0 *  - waves) * turbulence( decay * abs(normal + adjustedTime));
   qnoise = (2.0 *  - eqcolor) * turbulence( decay * abs(normal + adjustedTime));
   float b = pnoise( complex * (position) + vec3( 1.0 * adjustedTime ), vec3( 100.0 ) );

   if (fragment == true) {
     displacement = - sin(noise) + normalize(b * 0.5);
   } else {
     displacement = - sin(noise) + cos(b * 0.5);
   }

   // Aplicar amplitud de desplazamiento para efecto soundwave
   displacement = displacement * displacementAmplitude;

   // Desplazamiento base (movimiento orgánico normal) - SIEMPRE presente
   vec3 baseDisplacement = normal * displacement;
   
   // Combinar el movimiento base orgánico con el direccional
   vec3 finalDisplacement;
   
   if (directionalMultiplier > 0.0) {
     // EXPANSIÓN/CONTracción RADIAL: movimiento desde/hacia el centro para efecto soundwave
     // Obtener dirección radial desde el centro (normalizada)
     vec3 radialDirection = normalize(position);
     
     // Crear pulso de expansión/contracción usando múltiples frecuencias de sin/cos
     // Esto crea un efecto de onda que expande y contrae desde el centro
     float pulse1 = sin(adjustedTime * 2.0 + noise * 0.8) * 1.0;
     float pulse2 = cos(adjustedTime * 2.5 + qnoise * 0.5) * 0.8;
     float pulse3 = sin(adjustedTime * 3.0 + b * 0.6) * 0.6;
     float radialPulse = (pulse1 + pulse2 + pulse3) * 2.0;
     
     // Añadir variación aleatoria usando noise para hacer el pulso más orgánico
     float noiseVariation = sin(noise * 2.0) * 0.5 + cos(qnoise * 1.5) * 0.3;
     radialPulse = radialPulse + noiseVariation;
     
     // Crear desplazamiento radial que expande/contrae desde el centro - MUY pronunciado
     vec3 radialDisplacement = radialDirection * radialPulse * displacement * directionalMultiplier * 3.0;
     
     // Añadir también movimiento direccional adicional en múltiples direcciones para más dinamismo
     float dirX = sin(noise * 3.0 + adjustedTime * 1.2) * 0.8 + cos(qnoise * 2.0 - adjustedTime * 0.9) * 0.6;
     float dirY = cos(qnoise * 3.0 - adjustedTime * 1.0) * 0.8 + sin(b * 2.0 + adjustedTime * 0.8) * 0.6;
     float dirZ = sin(b * 3.5 + adjustedTime * 1.3) * 0.8 + cos(noise * 2.5 - adjustedTime * 1.0) * 0.6;
     vec3 additionalDirection = normalize(vec3(dirX, dirY, dirZ)) * displacement * directionalMultiplier * 1.2;
     
     // Combinar: movimiento base REDUCIDO + expansión/contracción radial MUY pronunciada + movimiento direccional adicional
     finalDisplacement = baseDisplacement * 0.2 + radialDisplacement * 2.5 + additionalDirection * 1.5;
   } else {
     // Cuando no hay movimiento direccional (idle o usuario habla), usar solo el movimiento orgánico base
     finalDisplacement = baseDisplacement;
   }

   vec3 newPosition = (position) + finalDisplacement;
   gl_Position = (projectionMatrix * modelViewMatrix) * vec4( newPosition, 1.0 );
   gl_PointSize = (pointscale);
  }
`

// Fragment shader - color simple según el estado
const fragmentShader = `
  varying float qnoise;

  uniform float time;
  uniform bool redhell;
  uniform vec3 pointColor; // Color de los puntos (RGB) - se actualiza según quién habla

  void main() {
    // Usar directamente el color que viene del uniform (verde o morado según quién habla)
    gl_FragColor = vec4(pointColor, 1.0);
  }
`

interface ShaderBackgroundProps {
  intensity?: number
  speed?: number
  isActive?: boolean
  chatState?: 'idle' | 'user-speaking' | 'bot-speaking'
}

export default function ShaderBackground({ 
  intensity = 1.0, 
  speed = 1.0,
  isActive = true,
  chatState = 'idle'
}: ShaderBackgroundProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [startTime] = useState(() => Date.now())
  
  // Log cuando cambia el chatState y forzar actualización del material
  useEffect(() => {
    console.log('ShaderBackground - chatState cambió:', chatState)
    const config = getChatStateConfig()
    console.log('Config actual:', {
      color: `rgb(${Math.round(config.pointColor.x * 255)}, ${Math.round(config.pointColor.y * 255)}, ${Math.round(config.pointColor.z * 255)})`,
      speedMultiplier: config.speedMultiplier,
      directionalMultiplier: config.directionalMultiplier,
      waves: config.waves,
      eqcolor: config.eqcolor
    })
    
    // Forzar actualización del material cuando cambia el estado
    if (shaderMaterialRef.current) {
      // Actualizar uniforms inmediatamente cuando cambia el estado
      const pointColorUniform = shaderMaterialRef.current.uniforms.pointColor.value
      if (pointColorUniform) {
        pointColorUniform.set(
          config.pointColor.x,
          config.pointColor.y,
          config.pointColor.z
        )
      }
      
      // Actualizar todos los uniforms
      shaderMaterialRef.current.uniforms.colorIntensity.value = config.colorIntensity
      shaderMaterialRef.current.uniforms.speedMultiplier.value = config.speedMultiplier
      shaderMaterialRef.current.uniforms.displacementAmplitude.value = config.displacementAmplitude
      shaderMaterialRef.current.uniforms.directionalMultiplier.value = config.directionalMultiplier
      shaderMaterialRef.current.uniforms.waves.value = config.waves
      shaderMaterialRef.current.uniforms.eqcolor.value = config.eqcolor
      
      // Forzar actualización del material
      shaderMaterialRef.current.needsUpdate = true
      
      console.log('Material actualizado con nuevos valores:', {
        waves: shaderMaterialRef.current.uniforms.waves.value,
        eqcolor: shaderMaterialRef.current.uniforms.eqcolor.value,
        speedMultiplier: shaderMaterialRef.current.uniforms.speedMultiplier.value,
        displacementAmplitude: shaderMaterialRef.current.uniforms.displacementAmplitude.value,
        directionalMultiplier: shaderMaterialRef.current.uniforms.directionalMultiplier.value,
        color: `rgb(${Math.round(pointColorUniform.x * 255)}, ${Math.round(pointColorUniform.y * 255)}, ${Math.round(pointColorUniform.z * 255)})`,
        needsUpdate: shaderMaterialRef.current.needsUpdate
      })
    }
  }, [chatState])

  // Valores exactos de options.js
  const options = {
    perlin: {
      vel: 0.002,
      speed: 0.0005,
      perlins: 5.0, // Aumentado aún más para puntos más grandes
      decay: 0.1,
      complex: 0.3,
      waves: 5.0,
      eqcolor: 1.0,
      fragment: true,
      redhell: true,
    },
    spin: {
      sinVel: 0.0,
      ampVel: 80.0,
    },
  }

  // Configuración según el estado del chat
  const getChatStateConfig = () => {
    switch (chatState) {
      case 'user-speaking':
        // Cuando el usuario habla: movimiento fluido pero más sutil, color MORADO
        return {
          pointColor: new THREE.Vector3(104 / 255, 53 / 255, 249 / 255), // Morado #6835F9
          colorIntensity: 1.0, // Color fijo morado
          speedMultiplier: 1.2, // Movimiento fluido pero moderado
          rotationSpeed: 0.003, // Rotación suave y fluida
          displacementAmplitude: 1.2, // Movimiento orgánico fluido pero sutil
          waves: 25.0, // Valor directo cuando está en conversación
          eqcolor: 15.0, // Valor directo cuando está en conversación
          directionalMultiplier: 0.0, // Sin expansión/contracción - solo movimiento orgánico fluido
        }
      case 'bot-speaking':
        // Cuando el bot habla: movimiento MUY dinámico con expansión/contracción pronunciada, color VERDE
        return {
          pointColor: new THREE.Vector3(171 / 255, 255 / 255, 46 / 255), // Verde #ABFF2E
          colorIntensity: 1.0, // Color fijo verde
          speedMultiplier: 1.5, // MUY rápido - representa la voz activa del asistente
          rotationSpeed: 0.012, // Rotación rápida y fluida
          displacementAmplitude: 1.0, // Amplitud ALTA para expansión/contracción visible
          waves: 25.0, // Valor directo cuando está en conversación
          eqcolor: 15.0, // Valor directo cuando está en conversación
          directionalMultiplier: 0.0, // Movimiento direccional pronunciado para efecto soundwave
        }
      default: // idle - cuando el robot está en silencio
        return {
          pointColor: new THREE.Vector3(171 / 255, 255 / 255, 46 / 255), // Verde base
          colorIntensity: 0.8, // Casi fijo pero con algo de variación
          speedMultiplier: 1.0, // Velocidad normal - mantener movimiento orgánico fluido
          rotationSpeed: 0.002, // Rotación normal - mantener movimiento orgánico fluido
          displacementAmplitude: 1.0, // Amplitud normal - movimiento orgánico original
          waves: 5.0, // Valor base cuando está en silencio
          eqcolor: 1.0, // Valor base cuando está en silencio
          directionalMultiplier: 0.0, // Sin movimiento direccional - solo movimiento orgánico fluido
        }
    }
  }

  // Obtener configuración inicial
  const initialConfig = getChatStateConfig()
  
  // Uniforms con colores y velocidad dinámicos
  // IMPORTANTE: Los uniforms deben ser objetos mutables, no recrearlos
  const uniforms = useMemo(() => {
    const chatConfig = getChatStateConfig()
    return {
      time: { value: 0 },
      pointscale: { value: options.perlin.perlins },
      decay: { value: options.perlin.decay },
      complex: { value: options.perlin.complex },
      waves: { value: chatConfig.waves }, // Usar valor directo según el estado
      eqcolor: { value: chatConfig.eqcolor }, // Usar valor directo según el estado
      fragment: { value: options.perlin.fragment },
      redhell: { value: options.perlin.redhell },
      pointColor: { value: chatConfig.pointColor.clone() }, // Clonar Vector3 para evitar referencias compartidas
      colorIntensity: { value: chatConfig.colorIntensity },
      speedMultiplier: { value: chatConfig.speedMultiplier },
      displacementAmplitude: { value: chatConfig.displacementAmplitude },
      directionalMultiplier: { value: chatConfig.directionalMultiplier },
    }
  }, [chatState])

  // Usar useRef para mantener el último estado y evitar actualizaciones innecesarias
  const lastChatStateRef = useRef(chatState)
  
  useFrame((state, delta) => {
    const chatConfig = getChatStateConfig()
    
    // Log para debug cada 60 frames (aproximadamente 1 vez por segundo)
    if (state.clock.elapsedTime % 1 < delta) {
      if (chatState !== lastChatStateRef.current) {
        console.log('ChatState cambió:', { 
          anterior: lastChatStateRef.current, 
          nuevo: chatState,
          color: chatConfig.pointColor,
          speedMultiplier: chatConfig.speedMultiplier,
          directionalMultiplier: chatConfig.directionalMultiplier,
          waves: chatConfig.waves,
          eqcolor: chatConfig.eqcolor
        })
        lastChatStateRef.current = chatState
      }
    }
    
    if (shaderMaterialRef.current && isActive) {
      // Actualizar time exactamente como en el ejemplo: options.perlin.speed * (Date.now() - start)
      const elapsed = Date.now() - startTime
      shaderMaterialRef.current.uniforms.time.value = options.perlin.speed * elapsed
      
      // Actualizar valores dinámicos según el estado del chat
      // Actualizar pointColor copiando los valores del Vector3 (Three.js requiere esto)
      const pointColorUniform = shaderMaterialRef.current.uniforms.pointColor.value
      if (pointColorUniform) {
        pointColorUniform.set(
          chatConfig.pointColor.x,
          chatConfig.pointColor.y,
          chatConfig.pointColor.z
        )
      }
      
      // Actualizar todos los uniforms y forzar actualización del material
      shaderMaterialRef.current.uniforms.colorIntensity.value = chatConfig.colorIntensity
      shaderMaterialRef.current.uniforms.speedMultiplier.value = chatConfig.speedMultiplier
      shaderMaterialRef.current.uniforms.displacementAmplitude.value = chatConfig.displacementAmplitude
      shaderMaterialRef.current.uniforms.directionalMultiplier.value = chatConfig.directionalMultiplier
      
      // Actualizar waves y eqcolor directamente según el estado (no desde options)
      shaderMaterialRef.current.uniforms.waves.value = chatConfig.waves
      shaderMaterialRef.current.uniforms.eqcolor.value = chatConfig.eqcolor
      
      // Los demás valores se mantienen constantes según options.js
      shaderMaterialRef.current.uniforms.pointscale.value = options.perlin.perlins
      shaderMaterialRef.current.uniforms.decay.value = options.perlin.decay
      shaderMaterialRef.current.uniforms.complex.value = options.perlin.complex
      shaderMaterialRef.current.uniforms.fragment.value = options.perlin.fragment
      shaderMaterialRef.current.uniforms.redhell.value = options.perlin.redhell
      
      // Forzar actualización del material cuando cambia el estado
      if (chatState !== lastChatStateRef.current) {
        shaderMaterialRef.current.needsUpdate = true
      }
    }

    // Rotación con velocidad ajustada según el estado del chat
    if (groupRef.current && isActive) {
      const performance = Date.now() * 0.003
      groupRef.current.rotation.x += (Math.sin(performance * options.spin.sinVel) * options.spin.ampVel * Math.PI) / 180
      // Velocidad de rotación ajustada según el estado del chat
      // Reducir rotación cuando hay movimiento direccional activo para que la expansión/contracción sea más visible
      const rotationMultiplier = chatConfig.directionalMultiplier > 0.0 ? 0.5 : 1.0
      groupRef.current.rotation.y += chatConfig.rotationSpeed * rotationMultiplier
    }
  })

  // Obtener la configuración actual para pasar como props
  const currentConfig = getChatStateConfig()

  return (
    <group ref={groupRef} scale={[0.6, 0.6, 0.6]}>
      <points ref={pointsRef}>
        <icosahedronGeometry args={[3, 7]} />
        <shaderMaterial
          ref={shaderMaterialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          // Pasar los valores actuales como props para que React Three Fiber los detecte
          key={`shader-${chatState}`}
        />
      </points>
    </group>
  )
}
