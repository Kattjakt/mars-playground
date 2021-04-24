const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }
  return {
    r: 0,
    g: 0,
    b: 0
  };
};
export const rgbToRgba = (rgb, opacity = 1) => {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
};
export const rgbToHex = (rgb) => {
  const transform = (channel) => {
    const hex = channel.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };
  return `#${transform(rgb.r)}${transform(rgb.g)}${transform(rgb.b)}`;
};
export const createColorpickers = () => {
  const container = document.querySelector(".values .colors");
  const createColorpicker = (color) => {
    const label = document.createElement("label");
    const element = document.createElement("input");
    element.setAttribute("type", "color");
    element.value = `${color.value}`;
    if (color.label) {
      label.appendChild(document.createTextNode(color.label));
    }
    element.oninput = () => {
      element.setAttribute("value", element.value);
      console.log(element.value);
    };
    label.prepend(element);
    container.appendChild(label);
    return () => {
      return hexToRgb(element.value);
    };
  };
  const getDaytimeSkyColor = createColorpicker({
    label: "DaytimeSky",
    value: "red"
  });
  const getTerrainColor = createColorpicker({
    label: "Terrain",
    value: "#deb887"
  });
  const getNightsky1Color = createColorpicker({
    label: "Nightsky 1",
    value: "#2a333e"
  });
  const getNightsky2Color = createColorpicker({
    label: "Nightsky 2",
    value: "#191d23"
  });
  const getDaytimesky1Color = createColorpicker({
    label: "Daytimesky 1",
    value: "#fffde5"
  });
  const getDaytimesky2Color = createColorpicker({
    label: "Daytimesky 2",
    value: "#612100"
  });
  return () => ({
    daytimeSkyColor: getDaytimeSkyColor(),
    terrainColor: getTerrainColor(),
    nightsky1Color: getNightsky1Color(),
    nightsky2Color: getNightsky2Color(),
    daytimesky1Color: getDaytimesky1Color(),
    daytimesky2Color: getDaytimesky2Color()
  });
};
