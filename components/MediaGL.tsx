"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useInView, useReducedMotion, useWebGL } from "@/lib/hooks";

/* -------------------------------------------------------------------------
   Shaders

   The whole point of this component is one interaction: wherever the cursor
   sits on the image, the image goes soft — as if the cursor were a lens
   resting on the surface. Everything else (bulge, zoom, chromatic edge) is
   tuned to be barely perceptible; it should read as "expensive", not "effect".
------------------------------------------------------------------------- */

const vertex = /* glsl */ `
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uAspect;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    vec2 d = uv - uMouse;
    d.x *= uAspect;
    float lens = smoothstep(0.22, 0.0, length(d));

    // A very shallow push toward the viewer under the cursor.
    pos.z += lens * uHover * 0.06;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uTex;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uAspect;       // plane aspect (w/h)
  uniform float uImageAspect;  // texture aspect (w/h)
  uniform float uZoom;
  uniform float uOpacity;
  varying vec2 vUv;

  const int TAPS = 14;

  vec2 coverUv(vec2 uv) {
    vec2 ratio = vec2(
      min(uAspect / uImageAspect, 1.0),
      min(uImageAspect / uAspect, 1.0)
    );
    uv = (uv - 0.5) / uZoom + 0.5;
    return vec2(
      uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  }

  // Golden-angle spiral sampling: smooth at low tap counts, no visible rings.
  vec3 lensBlur(vec2 uv, float radius) {
    if (radius < 0.0008) return texture2D(uTex, uv).rgb;
    vec3 sum = vec3(0.0);
    for (int i = 0; i < TAPS; i++) {
      float fi = float(i);
      float angle = fi * 2.39996323;
      float r = sqrt((fi + 0.5) / float(TAPS)) * radius;
      vec2 offset = vec2(cos(angle), sin(angle)) * r;
      offset.x /= uAspect;
      sum += texture2D(uTex, uv + offset).rgb;
    }
    return sum / float(TAPS);
  }

  void main() {
    vec2 uv = coverUv(vUv);

    vec2 d = vUv - uMouse;
    d.x *= uAspect;
    float dist = length(d);

    // Soft where the cursor is, sharp everywhere else.
    float lens = smoothstep(0.20, 0.02, dist) * uHover;
    float radius = lens * 0.05;

    vec3 color = lensBlur(uv, radius);

    // A whisper of chromatic separation only at the softest point.
    float ca = lens * 0.0035;
    color.r = lensBlur(uv + vec2(ca, 0.0), radius).r;
    color.b = lensBlur(uv - vec2(ca, 0.0), radius).b;

    // Lift the lens area a touch so the softness reads as light, not mud.
    color += lens * 0.045;

    gl_FragColor = vec4(color, uOpacity);
    #include <colorspace_fragment>
  }
`;

type PlaneProps = {
  src: string;
  hoverRef: React.RefObject<{ x: number; y: number; hover: number }>;
  onReady?: () => void;
};

function Plane({ src, hoverRef, onReady }: PlaneProps) {
  const { viewport, size, invalidate } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      uniforms: {
        uTex: { value: null as THREE.Texture | null },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uHover: { value: 0 },
        uAspect: { value: 1 },
        uImageAspect: { value: 1 },
        uZoom: { value: 1 },
        uOpacity: { value: 0 },
      },
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(src, (texture) => {
      if (cancelled) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      material.uniforms.uTex.value = texture;
      material.uniforms.uImageAspect.value = texture.image.width / texture.image.height;
      onReady?.();
      invalidate();
    });
    return () => {
      cancelled = true;
      const t = material.uniforms.uTex.value as THREE.Texture | null;
      t?.dispose();
      material.dispose();
    };
  }, [src, material, onReady, invalidate]);

  useEffect(() => {
    material.uniforms.uAspect.value = size.width / size.height;
  }, [size, material]);

  useFrame((_, delta) => {
    const target = hoverRef.current;
    const u = material.uniforms;
    const k = 1 - Math.pow(0.0012, delta); // frame-rate independent smoothing

    u.uMouse.value.x += (target.x - u.uMouse.value.x) * k;
    u.uMouse.value.y += (target.y - u.uMouse.value.y) * k;
    u.uHover.value += (target.hover - u.uHover.value) * k * 0.6;
    u.uZoom.value += (1 + target.hover * 0.045 - u.uZoom.value) * k * 0.5;
    if (u.uTex.value && u.uOpacity.value < 1) {
      u.uOpacity.value = Math.min(1, u.uOpacity.value + delta * 2.2);
    }

    if (meshRef.current) {
      meshRef.current.scale.set(viewport.width, viewport.height, 1);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1, 40, 40]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export type MediaGLProps = {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  /** Set false on media that should never take the lens treatment. */
  interactive?: boolean;
  priority?: boolean;
  sizes?: string;
  fit?: "cover" | "contain";
};

export default function MediaGL({
  src,
  alt,
  className = "",
  style,
  interactive = true,
  priority = false,
  fit = "cover",
}: MediaGLProps) {
  const webgl = useWebGL();
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>("15% 0px");
  const [glReady, setGlReady] = useState(false);
  const hoverRef = useRef({ x: 0.5, y: 0.5, hover: 0 });

  const useGL = webgl && !reduced && interactive;

  // The canvas unmounts when the media leaves the viewport. Without resetting
  // this, the fallback <img> stays hidden behind a canvas that no longer
  // exists — the media simply disappears until you scroll back and the texture
  // reloads. Reset on the way out so the image is always covering something.
  useEffect(() => {
    if (!useGL || !inView) setGlReady(false);
  }, [useGL, inView]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    hoverRef.current.x = (e.clientX - rect.left) / rect.width;
    hoverRef.current.y = 1 - (e.clientY - rect.top) / rect.height;
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-ink/10 ${className}`}
      style={style}
      onPointerMove={useGL ? onPointerMove : undefined}
      onPointerEnter={useGL ? () => (hoverRef.current.hover = 1) : undefined}
      onPointerLeave={useGL ? () => (hoverRef.current.hover = 0) : undefined}
    >
      {/* Always present: carries the alt text, covers first paint, and is the
          entire experience when WebGL or motion is unavailable. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${fit === "contain" ? "object-contain" : "object-cover"}`}
        style={{ opacity: glReady ? 0 : 1 }}
      />

      {useGL && inView && (
        <Canvas
          className="!absolute inset-0"
          dpr={[1, 1.75]}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 2.4], fov: 45 }}
          style={{ pointerEvents: "none" }}
        >
          <Plane src={src} hoverRef={hoverRef} onReady={() => setGlReady(true)} />
        </Canvas>
      )}
    </div>
  );
}
