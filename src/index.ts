import { adjustColor } from "./common";
import { createCheckboxes } from "./controls/checkbox";
import { createColorpickers, rgbToHex, rgbToRgba } from "./controls/color";
import { createSliders } from "./controls/slider";
import "./styles.scss";
import { addWalkthroughListener } from "./walkthrough";

type Vector2 = [number, number];

const halfPi = Math.PI / 2;
const LAG_OFFSET = 1000; // wtf

const getParams = createSliders();
const getFeatures = createCheckboxes();
const getColors = createColorpickers();

const initializeCanvas = () => {
  // Configure canvas
  const scene = document.querySelector(".scene") as HTMLCanvasElement;
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  const resize = () => {
    const rect = scene.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

  }

  window.addEventListener('load', resize, false);
  window.addEventListener('resize', resize, false);

  return {
    canvas,
    context,
  }
}

function* noiseGenerator(seed = 0) {
  while (true) {
    seed = (seed * 16807) % 2147483647;
    yield (seed - 1) / 2147483646;
  }

  return 0;
}

addWalkthroughListener()

const { canvas, context } = initializeCanvas()

// Main render loop
const render = (delta: number) => {
  const params = getParams();
  const features = getFeatures();
  const colors = getColors()

  const time = LAG_OFFSET + (delta * params.SPEED) / params.OCCURANCE;

  // Slide terrain up on initial load
  let slideupTransition = Math.min((time - 1050) / 250, 1);
  slideupTransition = 1 - Math.sin(slideupTransition * halfPi);

  // Run timecycle transition on initial load
  let timecycleTransition = Math.max(time - 1100, 0);
  timecycleTransition = Math.min(timecycleTransition / 500, 1);
  timecycleTransition = 1 - Math.sin(timecycleTransition * halfPi);

  // Stack timecycle with the configurable parameter
  const timecycle = timecycleTransition + params.TIMECYCLE;

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Sun position
  const sunOffset = timecycle * canvas.height / 1.65;
  const sunX = canvas.width / 2;
  const sunY = canvas.height / 2.2 + sunOffset;

  // Sky (nighttime)
  const drawDaytimeSky = () => {
    const nightSky = context.createRadialGradient(
      sunX,
      sunY,
      20,
      sunX,
      sunY - 150 * timecycle,
      200
    );

    const color1 = rgbToRgba(colors.nightsky1Color, timecycle);
    const color2 = rgbToRgba(colors.nightsky2Color, timecycle);
    nightSky.addColorStop(0, color1);
    nightSky.addColorStop(1, color2);

    context.fillStyle = nightSky;
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Sky (daytime)
  const drawNighttimeSky = () => {
    const color1 = rgbToRgba(colors.daytimesky1Color, (1 - timecycle) * 0.85)
    const color2 = rgbToRgba(colors.daytimesky2Color, 0.47 * (1 - timecycle))

    const sky = context.createRadialGradient(sunX, sunY, 20, sunX, sunY - 150 * timecycle, 500 / 2.5);
    sky.addColorStop(0, color1);
    sky.addColorStop(1, color2);
    context.fillStyle = sky;
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Sun
  const drawSun = () => {
    const color1 = rgbToRgba(colors.daytimesky1Color, (1 - timecycle) * 0.5)

    context.fillStyle = color1;
    context.beginPath();
    context.arc(sunX, sunY, Math.abs((canvas.width / 20) * (1 - timecycle)), 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  };

  // Daytime radial
  const drawSunRadial = () => {
    const color1 = rgbToRgba(colors.daytimesky1Color, 0.25 * (1 - timecycle))

    const factor = 1 - timecycle;
    const backgroundRay = context.createRadialGradient(sunX, sunY, 30, sunX, sunY + (canvas.height / 6 * factor), canvas.height / 1.65);
    backgroundRay.addColorStop(0, color1);
    backgroundRay.addColorStop(1, "transparent");
    context.fillStyle = backgroundRay;
    context.fillRect(0, 0, canvas.width, canvas.height);

  };

  // Sun glare/rays
  const drawSunGlare = () => {
    const factor = Math.pow(1 - timecycle, 2);
    const ray = context.createRadialGradient(sunX, sunY, 30, sunX, sunY + (canvas.height / 6 * factor), canvas.height / 1.65);
    const rayOpacity = Math.pow(factor, 2);
    const color1 = rgbToRgba(colors.daytimesky1Color, 0.3 * rayOpacity)

    ray.addColorStop(0, color1);
    ray.addColorStop(1, "transparent");
    context.fillStyle = ray;
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawTerrainGeometry = (points: Vector2[]) => {
    context.beginPath();

    for (const [x, y] of points) {
      context.lineTo(x * canvas.width, y * canvas.height);
    }

    // Finalize the shape so we can fill it
    context.lineTo(canvas.width, canvas.height);
    context.lineTo(0, canvas.height);
  };

  const drawTerrainGeometrySmooth = (points: Vector2[]) => {
    context.beginPath();

    let i = 0;
    for (i = 0; i < points.length - 2; i++) {
      const xc = (points[i][0] + points[i + 1][0]) / 2;
      const yc = (points[i][1] + points[i + 1][1]) / 2;

      const x = points[i][0] * canvas.width;
      const y = points[i][1] * canvas.height;
      context.quadraticCurveTo(x, y, xc * canvas.width, yc * canvas.height);
    }

    context.quadraticCurveTo(points[i][0] * canvas.width, points[i][1] * canvas.height, points[i + 1][0] * canvas.width, points[i + 1][1] * canvas.height);

    // Finalize the shape so we can fill it
    context.lineTo(canvas.width, canvas.height);
    context.lineTo(0, canvas.height);
  };

  // Add a distance-based shade to the layer
  const drawTerrainColor = (y: number) => {
    let intensity = (Math.pow(y, 1.2)) * canvas.height / 100;

    let color = rgbToHex(colors.terrainColor)
    color = adjustColor(color, Math.floor(intensity * -params.HILL_SHADE));
    color = adjustColor(color, Math.floor(timecycle * -125));
    context.fillStyle = color;
    context.fill();
  };

  const drawTerrainColorBasic = (seed: number) => {
    const colors = ["red", "blue", "green", "yellow", "pink", "purple", "magenta"].reverse();
    const color = Math.floor(seed) % colors.length;
    context.fillStyle = colors[color];
    context.fill();
  };

  if (features.daytimeSky) drawDaytimeSky();
  if (features.nighttimeSky) drawNighttimeSky();
  if (features.sunRadial) drawSunRadial();
  if (features.sun) drawSun();

  const yStep = 1 / canvas.height;

  // Iterate over every canvas row
  for (let y = 0; y <= 1; y += yStep) {
    if (features.terrainClipping) {
      const clipNear = 0.1;
      const clipFar = 0.9;

      // Skip drawing things that are barely visible
      if (y < clipNear || y > clipFar) continue;
    }

    // Should we render at this y-coordinate?
    const eligble = (time - ((y * canvas.height))) % params.OCCURANCE < 1;

    if (!eligble) {
      continue;
    }

    let baseline = y;
    if (features.terrainBaseline) {
      baseline = Math.pow(y * canvas.height * params.BASELINE_2, params.BASELINE_1) * params.BASELINE_3;
    }

    const distance = baseline;
    const seed = Math.floor((time - (y * canvas.height)) / params.OCCURANCE);
    const random = noiseGenerator(Math.floor(seed));
    const step = 1 / params.OCCURANCE;

    let points: Vector2[] = [];

    for (let x = -step; x <= 1 + step; x += step) {
      let normalized = 1;
      let roundiness = 0;
      let terrainOffset = 0;
      let perspective = y;
      let center = 0;

      if (features.terrainCenter) {
        center = 0.6;
      }

      if (features.terrainNormalized) {
        normalized = x - 0.5;
      }

      if (features.terrainRoundiness) {
        const deviation =
          Math.abs(Math.pow(normalized * params.HORIZON_1, Math.floor(params.HORIZON_2))) *
          params.HORIZON_3;
        const wiggle = (1 + Math.sin(time / params.HORIZON_4)) * deviation * params.HORIZON_5;

        roundiness = deviation + wiggle;
        roundiness /= 500;
      }

      if (features.terrainOffset) {
        const value = random.next().value / params.HILL_SIZE;

        terrainOffset = value * (0.6 + distance);
      }

      if (features.terrainPerspective) {
        perspective =
          Math.pow((baseline * params.PERSPECTIVE_1), params.PERSPECTIVE_2) * params.PERSPECTIVE_3;
      }

      const offset = (perspective + roundiness - terrainOffset)
      const finalY = center + slideupTransition + offset;

      points.push([x, finalY]);
    }

    if (features.terrainSmoothGeometry) drawTerrainGeometrySmooth(points);
    else drawTerrainGeometry(points);

    if (features.terrainColor) drawTerrainColor(y);
    else drawTerrainColorBasic(seed);
  }

  if (features.sunGlare) drawSunGlare();

  requestAnimationFrame(render);
};

render(0);
