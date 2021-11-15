<template>
  <div class="relative cursor-grab active:cursor-grabbing">
    <div id="scene-container" class="aspect" ref="sceneContainer" :style="{ '--aspect-ratio': aspectRatio }"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, InjectionKey, reactive, toRefs } from '@nuxtjs/composition-api';
import { log } from 'JS/global';
import * as THREE from 'three';
import merge from 'lodash/merge';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ColorRepresentation, DirectionalLight, HemisphereLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { mapState, Store } from 'vuex';
import { StoreState } from 'Types/types';

// eslint-disable-next-line symbol-description
export const key: InjectionKey<Store<StoreState>> = Symbol();

let ambientLight: HemisphereLight;
let container: HTMLElement;
let camera: PerspectiveCamera;
let controls: OrbitControls;
let mainLight: DirectionalLight;
let object: any;
let renderer: WebGLRenderer;
let scene: Scene;

interface SceneSettings {
  animation: {
    rotation: {
      x: number;
      y: number;
      z: number;
      xSineMax: number;
    };
  };
  camera: {
    fov: number;
    near: number;
    far: number;
    position: {
      x: number;
      y: number;
      z: number;
    };
    rotation: {
      x: number;
      y: number;
      z: number;
    };
  };
  lights: {
    ambient: {
      groundColor: ColorRepresentation;
      intensity: number;
      skyColor: ColorRepresentation;
    };
    directional: {
      color: ColorRepresentation;
      intensity: number;
      position: {
        x: number;
        y: number;
        z: number;
      };
    };
  };
  object: {
    scale: {
      x: number;
      y: number;
      z: number;
    };
    rotation: {
      x: number;
      y: number;
      z: number;
    };
  };
  scene: {
    bgColor: string;
  };
}

export default defineComponent({
  name: 'ThreeJSViewer',
  components: {},
  props: {
    aspectRatio: { type: String, default: '16 / 9' },
    objectUrl: { type: String, required: true },
    sceneBackgroundUrl: String,
    sceneSettings: String,
  },
  setup(props) {
    const state = reactive<{
      animationXDirection: number;
      buildVersion: string;
      camera: any;
      container: any;
      controls: any;
      object: any;
      renderer: any;
      scene: any;
      settings: SceneSettings;
    }>({
      animationXDirection: 1,
      buildVersion: '',
      camera: null,
      container: null,
      controls: null,
      object: null,
      renderer: null,
      scene: null,
      settings: {
        animation: {
          rotation: {
            x: 0,
            y: 0,
            z: 0,
            xSineMax: 0,
          },
        },
        camera: {
          fov: 60,
          near: 0.1,
          far: 30,
          position: {
            x: 0,
            y: 5,
            z: 10,
          },
          rotation: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        lights: {
          ambient: {
            groundColor: 0x222222,
            intensity: 1,
            skyColor: 0xffffff,
          },
          directional: {
            color: 0xffffff,
            intensity: 4.0,
            position: {
              x: 10,
              y: 10,
              z: 10,
            },
          },
        },
        object: {
          scale: {
            x: 1,
            y: 1,
            z: 1,
          },
          rotation: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        scene: {
          bgColor: 'rgb(35, 31, 32)',
        },
      },
    });

    let buildVersion = '';
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 32; i > 0; --i) buildVersion += chars[Math.floor(Math.random() * chars.length)];
    state.buildVersion = buildVersion;

    if (props.sceneSettings) {
      merge(state.settings, JSON.parse(props.sceneSettings));
    }

    return { ...toRefs(state) };
  },
  computed: {
    ...mapState<StoreState>({
      reduceMotion: (state: StoreState) => state.reduceMotion,
    }),
  },
  methods: {
    animateObject() {
      if (object && !this.reduceMotion) {
        if (this.settings.animation.rotation.xSineMax > 0 && this.settings.animation.rotation.x > 0) {
          if (this.animationXDirection === 1) {
            object.scene.rotation.x += this.settings.animation.rotation.x;

            if (object.scene.rotation.x > this.settings.animation.rotation.xSineMax) {
              this.animationXDirection = -1;
            }
          } else {
            object.scene.rotation.x -= this.settings.animation.rotation.x;

            if (object.scene.rotation.x < this.settings.animation.rotation.xSineMax * -1) {
              this.animationXDirection = 1;
            }
          }
        } else if (this.settings.animation.rotation.x > 0) {
          object.scene.rotation.x += this.settings.animation.rotation.x;
        } else if (this.settings.animation.rotation.x < 0) {
          object.scene.rotation.x -= this.settings.animation.rotation.x;
        }
        if (this.settings.animation.rotation.y > 0) {
          object.scene.rotation.y += this.settings.animation.rotation.y;
        } else if (this.settings.animation.rotation.y < 0) {
          object.scene.rotation.y -= this.settings.animation.rotation.y;
        }
        if (this.settings.animation.rotation.z > 0) {
          object.scene.rotation.z += this.settings.animation.rotation.z;
        } else if (this.settings.animation.rotation.z < 0) {
          object.scene.rotation.z -= this.settings.animation.rotation.z;
        }
      }
    },
    init() {
      // set container
      container = this.$refs.sceneContainer as HTMLElement;
      // add camera
      const fov = this.settings.camera.fov; // Field of view
      const aspect = container.clientWidth / container.clientHeight;
      const near = this.settings.camera.near; // the near clipping plane
      const far = this.settings.camera.far; // the far clipping plane
      camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      camera.position.set(
        this.settings.camera.position.x,
        this.settings.camera.position.y,
        this.settings.camera.position.z
      );
      camera.rotation.set(
        this.settings.camera.rotation.x,
        this.settings.camera.rotation.y,
        this.settings.camera.rotation.z
      );
      // create scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(this.settings.scene.bgColor);
      if (this.sceneBackgroundUrl) {
        scene.background = new THREE.TextureLoader().load(`${this.sceneBackgroundUrl}?v=${this.buildVersion}`);
      }
      // add lights
      ambientLight = new THREE.HemisphereLight(
        this.settings.lights.ambient.skyColor,
        this.settings.lights.ambient.groundColor,
        this.settings.lights.ambient.intensity
      );
      mainLight = new THREE.DirectionalLight(
        this.settings.lights.directional.color,
        this.settings.lights.directional.intensity
      );
      mainLight.position.set(
        this.settings.lights.directional.position.x,
        this.settings.lights.directional.position.y,
        this.settings.lights.directional.position.z
      );
      scene.add(ambientLight, mainLight);
      // add controls
      controls = new OrbitControls(camera, container);
      controls.enableZoom = false;
      // create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.physicallyCorrectLights = true;
      container.appendChild(renderer.domElement);
      // set aspect ratio to match the new browser window aspect ratio
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      const loader = new GLTFLoader();
      loader.load(
        `${this.objectUrl}?v=${this.buildVersion}`,
        (gltf) => {
          object = gltf;
          object.scene.scale.set(
            this.settings.object.scale.x,
            this.settings.object.scale.y,
            this.settings.object.scale.z
          );
          object.scene.rotation.set(
            this.settings.object.rotation.x,
            this.settings.object.rotation.y,
            this.settings.object.rotation.z
          );
          scene.add(object.scene);
        },
        undefined,
        undefined
      );
      renderer.setAnimationLoop(() => {
        this.render();
      });
    },
    render() {
      if (renderer) {
        this.animateObject();
        renderer.render(scene, camera);
      }
    },
  },
  mounted() {
    log(`Loaded ThreeJSViewer`, this.settings, JSON.stringify(this.settings));
    this.init();
  },
});
</script>
