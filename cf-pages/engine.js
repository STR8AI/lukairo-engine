
import { startGlobe } from "./visuals/globe.js";
import { startPlatforms } from "./visuals/platforms.js";

const canvas = document.getElementById("scene");

startGlobe(canvas);
startPlatforms(canvas);

// Central engine orchestrator
import { Renderer } from "./core/renderer.js";
import { createState } from "./core/state.js";
import { Physics } from "./core/physics.js";
import { UISystem } from "./core/ui-system.js";
import { DataLayer } from "./core/data-layer.js";

export class Engine {
  constructor() {
    this.renderer = new Renderer();
    this.state = createState();
    this.physics = new Physics();
    this.ui = new UISystem();
    this.data = new DataLayer();
    this.modules = new Map();
  }

  registerModule(name, factory) {
    this.modules.set(name, factory);
    return () => this.modules.delete(name);
  }

  async start() {
    let last = performance.now();
    this.renderer.init({
      onFrame: (now) => {
        const delta = now - last;
        this.physics.step(delta);
        last = now;
      },
    });

    for (const [name, factory] of this.modules.entries()) {
      const api = {
        engine: this,
        renderer: this.renderer,
        state: this.state,
        physics: this.physics,
        ui: this.ui,
        data: this.data,
      };
      await factory(api);
      console.info(`Module '${name}' initialized`);
    }
  }

  stop() {
    this.renderer.destroy();
  }
}

export function createEngine() {
  return new Engine();
}

