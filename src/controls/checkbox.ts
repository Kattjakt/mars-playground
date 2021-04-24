interface SliderParams {
  checked: boolean;
  label?: string;
  disabled?: boolean;
}

export const createCheckboxes = () => {
  const container = document.querySelector(".features .checkboxes") as HTMLDivElement;

  const createSlider = (slider: SliderParams) => {
    const label = document.createElement("label");
    const element = document.createElement("input");

    element.setAttribute("type", "checkbox");
    element.checked = slider.checked;

    if (slider.disabled) {
      element.disabled = true;
    }

    if (slider.label) {
      label.appendChild(document.createTextNode(slider.label));
    }

    label.prepend(element);
    container.appendChild(label);

    return () => element.checked;
  };

  const getTerrainMovement = createSlider({
    label: "TerrainMovement",
    checked: true,
    disabled: true
  });

  const getTerrainBaseline = createSlider({
    label: "TerrainBaseline",
    checked: true
  });

  const getTerrainPerspective = createSlider({
    label: "TerrainPerspective",
    checked: true
  });

  const getTerrainNormalized = createSlider({
    label: "TerrainNormalized",
    checked: true
  });

  const getTerrainOffset = createSlider({
    label: "TerrainOffset",
    checked: true
  });

  const getTerrainCenter = createSlider({
    label: "TerrainCenter",
    checked: true
  });

  const getTerrainRoundiness = createSlider({
    label: "TerrainRoundiness",
    checked: true
  });

  const getTerrainClipping = createSlider({
    label: "TerrainClipping",
    checked: true
  });

  const getTerrainSmoothGeometry = createSlider({
    label: "TerrainSmoothGeometry",
    checked: true
  });

  const getTerrainColor = createSlider({
    label: "TerrainColor",
    checked: true
  });

  const getDaytimeSky = createSlider({
    label: "DaytimeSky",
    checked: true
  });

  const getNighttimeSky = createSlider({
    label: "NighttimeSky",
    checked: true
  });

  const getSun = createSlider({
    label: "Sun",
    checked: true
  });

  const getSunRadial = createSlider({
    label: "SunRadial",
    checked: true
  });

  const getSunGlare = createSlider({
    label: "SunGlare",
    checked: true
  });

  return () => ({
    terrainColor: getTerrainColor(),
    terrainSmoothGeometry: getTerrainSmoothGeometry(),
    terrainMovement: getTerrainMovement(),
    terrainBaseline: getTerrainBaseline(),
    terrainClipping: getTerrainClipping(),
    terrainNormalized: getTerrainNormalized(),
    terrainRoundiness: getTerrainRoundiness(),
    terrainOffset: getTerrainOffset(),
    terrainPerspective: getTerrainPerspective(),
    terrainCenter: getTerrainCenter(),
    daytimeSky: getDaytimeSky(),
    nighttimeSky: getNighttimeSky(),
    sun: getSun(),
    sunRadial: getSunRadial(),
    sunGlare: getSunGlare()
  });
};
