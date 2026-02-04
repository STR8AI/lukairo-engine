/**
 * LUKAIRO Neural Core - Three.js Visualization Module
 * Reusable initialization and animation for the Neural Core 3D visualization
 */

(function(window) {
  'use strict';

  // Default Configuration
  const defaultConfig = {
    containerId: 'neural-core-container',
    texturePath: '/assets/textures/',
    textures: {
      gears: 'lukairo_gears.png',
      circuits: 'lukairo_circuits.png',
      globe: 'lukairo_globe.png'
    },
    layers: {
      gears: { radius: 1, speed: 0.003, reverse: false },
      circuits: { radius: 1.5, speed: 0.002, reverse: true },
      globe: { radius: 2, speed: 0.001, reverse: false }
    },
    starfield: {
      count: 1200,
      radius: 50
    },
    camera: {
      fov: 45,
      near: 0.1,
      far: 1000,
      position: { x: 0, y: 0, z: 6 }
    },
    scene: {
      fogColor: 0x090c11,
      fogNear: 10,
      fogFar: 50,
      clearColor: 0x090c11
    }
  };

  /**
   * Neural Core Class
   */
  class NeuralCore {
    constructor(userConfig = {}) {
      this.config = { ...defaultConfig, ...userConfig };
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.layers = {};
      this.starfield = null;
      this.animationId = null;
      this.isPageVisible = true;
      this.isInitialized = false;
      
      // Store bound event handlers for cleanup
      this.boundHandlers = {
        contextLost: null,
        contextRestored: null,
        resize: null,
        visibilityChange: null
      };
    }

    /**
     * Check WebGL Support
     */
    checkWebGLSupport() {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
      } catch (e) {
        return false;
      }
    }

    /**
     * Initialize the Neural Core visualization
     */
    init() {
      if (this.isInitialized) {
        console.warn('Neural Core already initialized');
        return;
      }

      if (!window.THREE) {
        console.error('Three.js not loaded. Please include Three.js before initializing Neural Core.');
        this.showFallback();
        return;
      }

      if (!this.checkWebGLSupport()) {
        console.warn('WebGL not supported');
        this.showFallback();
        return;
      }

      try {
        this.initScene();
        this.animate();
        this.setupEventListeners();
        this.isInitialized = true;
      } catch (error) {
        console.error('Failed to initialize Neural Core:', error);
        this.showFallback();
      }
    }

    /**
     * Initialize Three.js Scene
     */
    initScene() {
      const container = document.getElementById(this.config.containerId);
      if (!container) {
        throw new Error(`Container element #${this.config.containerId} not found`);
      }
      
      // Scene Setup
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(
        this.config.scene.fogColor,
        this.config.scene.fogNear,
        this.config.scene.fogFar
      );

      // Camera Setup
      this.camera = new THREE.PerspectiveCamera(
        this.config.camera.fov,
        window.innerWidth / window.innerHeight,
        this.config.camera.near,
        this.config.camera.far
      );
      this.camera.position.set(
        this.config.camera.position.x,
        this.config.camera.position.y,
        this.config.camera.position.z
      );

      // Renderer Setup
      this.renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setClearColor(this.config.scene.clearColor, 1);
      container.appendChild(this.renderer.domElement);

      // Bind and store event handlers for WebGL context
      this.boundHandlers.contextLost = this.handleContextLost.bind(this);
      this.boundHandlers.contextRestored = this.handleContextRestored.bind(this);
      
      // Handle WebGL Context Loss
      this.renderer.domElement.addEventListener('webglcontextlost', this.boundHandlers.contextLost, false);
      this.renderer.domElement.addEventListener('webglcontextrestored', this.boundHandlers.contextRestored, false);

      // Lighting
      this.setupLighting();

      // Create Starfield
      this.createStarfield();

      // Load Textures and Create Layers
      this.loadTextures();
    }

    /**
     * Setup Scene Lighting
     */
    setupLighting() {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      this.scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x6CEAD9, 1, 100);
      pointLight1.position.set(5, 5, 5);
      this.scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x8AB4F8, 0.8, 100);
      pointLight2.position.set(-5, -5, 5);
      this.scene.add(pointLight2);
    }

    /**
     * Create Starfield Background
     */
    createStarfield() {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      
      for (let i = 0; i < this.config.starfield.count; i++) {
        const radius = this.config.starfield.radius;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        vertices.push(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        );
      }
      
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      
      const material = new THREE.PointsMaterial({
        color: 0x6CEAD9,
        size: 0.05,
        transparent: true,
        opacity: 0.6
      });
      
      this.starfield = new THREE.Points(geometry, material);
      this.scene.add(this.starfield);
    }

    /**
     * Load Textures
     */
    loadTextures() {
      const loader = new THREE.TextureLoader();
      const loadingManager = new THREE.LoadingManager();
      
      loadingManager.onLoad = () => {
        this.hideLoading();
      };

      loadingManager.onError = (url) => {
        console.warn('Texture loading failed:', url, '- using fallback');
      };

      // Load each layer texture
      Object.keys(this.config.layers).forEach(layerName => {
        const texturePath = this.config.texturePath + this.config.textures[layerName];
        
        loader.load(
          texturePath,
          (texture) => {
            this.createLayer(layerName, texture);
          },
          undefined,
          (error) => {
            console.warn(`Failed to load ${layerName} texture, creating without texture`);
            this.createLayer(layerName, null);
          }
        );
      });
    }

    /**
     * Create Individual Layer
     */
    createLayer(name, texture) {
      const layerConfig = this.config.layers[name];
      const geometry = new THREE.SphereGeometry(layerConfig.radius, 32, 32);
      
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        wireframe: !texture
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = {
        speed: layerConfig.speed,
        reverse: layerConfig.reverse
      };
      
      this.layers[name] = mesh;
      this.scene.add(mesh);
    }

    /**
     * Hide Loading Overlay
     */
    hideLoading() {
      const overlay = document.getElementById('loading-overlay');
      if (overlay) {
        overlay.classList.add('hidden');
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 500);
      }
    }

    /**
     * Show Fallback Message
     */
    showFallback() {
      const fallback = document.getElementById('fallback-message');
      if (fallback) {
        fallback.classList.add('active');
      }
      this.hideLoading();
    }

    /**
     * Handle WebGL Context Loss
     */
    handleContextLost(event) {
      event.preventDefault();
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      console.warn('WebGL context lost');
    }

    /**
     * Handle WebGL Context Restored
     */
    handleContextRestored() {
      console.log('WebGL context restored');
      this.isInitialized = false;
      this.init();
    }

    /**
     * Animation Loop
     */
    animate() {
      this.animationId = requestAnimationFrame(() => this.animate());

      // Only animate if page is visible
      if (!this.isPageVisible) return;

      // Rotate layers
      Object.keys(this.layers).forEach(layerName => {
        const layer = this.layers[layerName];
        const direction = layer.userData.reverse ? -1 : 1;
        layer.rotation.y += layer.userData.speed * direction;
        layer.rotation.x += layer.userData.speed * 0.5 * direction;
      });

      // Slowly rotate starfield
      if (this.starfield) {
        this.starfield.rotation.y += 0.0001;
      }

      this.renderer.render(this.scene, this.camera);
    }

    /**
     * Handle Window Resize
     */
    onWindowResize() {
      if (!this.camera || !this.renderer) return;
      
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Handle Page Visibility
     */
    handleVisibilityChange() {
      this.isPageVisible = !document.hidden;
    }

    /**
     * Setup Event Listeners
     */
    setupEventListeners() {
      // Bind and store event handlers for cleanup
      this.boundHandlers.resize = () => this.onWindowResize();
      this.boundHandlers.visibilityChange = () => this.handleVisibilityChange();
      
      window.addEventListener('resize', this.boundHandlers.resize, false);
      document.addEventListener('visibilitychange', this.boundHandlers.visibilityChange, false);
    }

    /**
     * Cleanup and Dispose
     */
    dispose() {
      // Cancel animation frame
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      
      // Remove event listeners
      if (this.boundHandlers.resize) {
        window.removeEventListener('resize', this.boundHandlers.resize, false);
      }
      if (this.boundHandlers.visibilityChange) {
        document.removeEventListener('visibilitychange', this.boundHandlers.visibilityChange, false);
      }
      
      // Remove WebGL context event listeners
      if (this.renderer && this.renderer.domElement) {
        if (this.boundHandlers.contextLost) {
          this.renderer.domElement.removeEventListener('webglcontextlost', this.boundHandlers.contextLost, false);
        }
        if (this.boundHandlers.contextRestored) {
          this.renderer.domElement.removeEventListener('webglcontextrestored', this.boundHandlers.contextRestored, false);
        }
      }
      
      // Dispose renderer
      if (this.renderer) {
        this.renderer.dispose();
      }

      // Dispose geometries and materials
      Object.values(this.layers).forEach(layer => {
        if (layer.geometry) layer.geometry.dispose();
        if (layer.material) layer.material.dispose();
      });

      if (this.starfield) {
        if (this.starfield.geometry) this.starfield.geometry.dispose();
        if (this.starfield.material) this.starfield.material.dispose();
      }

      this.isInitialized = false;
    }
  }

  // Export to window
  window.NeuralCore = NeuralCore;

  // Auto-initialize if data-auto-init attribute is present
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  function autoInit() {
    const containers = document.querySelectorAll('[data-neural-core-auto-init]');
    containers.forEach(container => {
      const config = container.dataset.neuralCoreConfig ? 
        JSON.parse(container.dataset.neuralCoreConfig) : 
        { containerId: container.id };
      
      const core = new NeuralCore(config);
      core.init();
    });
  }

})(window);
