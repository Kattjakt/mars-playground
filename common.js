export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const adjustColor = (color, amount) => {
  return "#" + color.replace(/^#/, "").replace(/../g, (color2) => ("0" + Math.min(255, Math.max(0, parseInt(color2, 16) + amount)).toString(16)).substr(-2));
};
