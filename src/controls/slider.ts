interface SliderParams {
  value: number;
  min: number;
  max: number;
  step?: number;
  label?: string;
}

export const createSliders = () => {
  const container = document.querySelector(".values .sliders") as HTMLDivElement;

  const createSlider = (slider: SliderParams) => {
    const element = document.createElement("input");
    const step = slider.step || Math.abs(slider.max - slider.min) / 1000;

    element.setAttribute("type", "range");
    element.min = `${slider.min}`;
    element.max = `${slider.max}`;
    element.step = `${step}`;
    element.defaultValue = `${slider.value}`;

    // Ugly, but seems like the best way to make attr(value) work in CSS
    element.onchange = () => element.setAttribute("value", element.value);

    if (slider.label) {
      element.setAttribute("label", slider.label);
    }

    container.appendChild(element);

    return () => +element.value;
  };

  const getTimeCycle = createSlider({
    label: "Timecycle",
    value: 0,
    min: 0,
    max: 1
  });

  const getOccurance = createSlider({
    label: "Occurance",
    value: 9,
    min: 1,
    max: 50,
    step: 1
  });

  const getSpeed = createSlider({
    label: "Speed",
    value: 1,
    min: 0.1,
    max: 10
  });

  const getHillSize = createSlider({
    label: "HillSize",
    value: 15.6,
    min: 0.5,
    max: 50
  });

  const getHillShade = createSlider({
    label: "HillShade",
    value: 75,
    min: 10,
    max: 250
  });

  const getBaseline1 = createSlider({
    label: "Baseline 1",
    value: 2.85,
    min: 1,
    max: 8
  });

  const getBaseline2 = createSlider({
    label: "Baseline 2",
    value: 0.00375,
    min: 0.001,
    max: 0.025
  });

  const getBaseline3 = createSlider({
    label: "Baseline 3",
    value: 1.2,
    min: 0.1,
    max: 10
  });

  const getPerspective1 = createSlider({
    label: "Perspective 1",
    value: 2,
    min: 0.1,
    max: 4
  });

  const getPerspective2 = createSlider({
    label: "Perspective 2",
    value: 2.5,
    min: 0.2,
    max: 4
  });

  const getPerspective3 = createSlider({
    label: "Perspective 3",
    value: 0.022,
    min: 0.01,
    max: 0.85
  });

  const getHorizon1 = createSlider({
    label: "Horizon 1",
    value: 4,
    min: 1,
    max: 5
  });

  const getHorizon2 = createSlider({
    label: "Horizon 2",
    value: 2,
    min: 1,
    max: 5
  });

  const getHorizon3 = createSlider({
    label: "Horizon 3",
    value: -2.5,
    min: -5,
    max: 5
  });

  const getHorizon4 = createSlider({
    label: "Horizon 4",
    value: 100,
    min: 10,
    max: 200
  });

  const getHorizon5 = createSlider({
    label: "Horizon 5",
    value: 0.5,
    min: 0.1,
    max: 2
  });

  return () => ({
    TIMECYCLE: getTimeCycle(),
    OCCURANCE: getOccurance(),
    SPEED: getSpeed(),

    HILL_SIZE: getHillSize(),
    HILL_SHADE: getHillShade(),

    BASELINE_1: getBaseline1(),
    BASELINE_2: getBaseline2(),
    BASELINE_3: getBaseline3(),

    PERSPECTIVE_1: getPerspective1(),
    PERSPECTIVE_2: getPerspective2(),
    PERSPECTIVE_3: getPerspective3(),

    HORIZON_1: getHorizon1(),
    HORIZON_2: getHorizon2(),
    HORIZON_3: getHorizon3(),
    HORIZON_4: getHorizon4(),
    HORIZON_5: getHorizon5()
  });
};
