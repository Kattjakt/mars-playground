import { wait } from "./common";

export const addWalkthroughListener = () => {
  const button = document.querySelector("#start-walkthrough");

  if (!button) {
    return;
  }

  button.addEventListener("click", async () => {
    const elements = document.querySelectorAll<HTMLInputElement>(".features .checkboxes input");
    const checkboxes = Array.from(elements);

    button.setAttribute("disabled", "true")

    checkboxes.forEach(checkbox => checkbox.checked = false)

    for (const checkbox of checkboxes) {
      await wait(2500);

      checkbox.checked = true;
    }

    button.removeAttribute("disabled")
  });
}