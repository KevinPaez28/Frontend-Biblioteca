import { Spinner } from "spin.js";
import "../Styles/Dashboard/dashboard.css"
const options = {
    lines: 12,
    length: 12,
    width: 4,
    radius: 8,
    speed: 100,
    color: "#000",
};

const spinnerMap = new Map();

export const showSpinner = (container) => {
    if (!container) return;
    if (spinnerMap.has(container)) return;

    if (getComputedStyle(container).position === "static") {
        container.style.position = "relative";
    }

    const overlay = document.createElement("div");
    overlay.classList.add("spinner-overlay");

    container.appendChild(overlay);

    const spinner = new Spinner(options).spin(overlay);

    spinnerMap.set(container, { spinner, overlay });
};

export const hideSpinner = (container) => {
    const data = spinnerMap.get(container);
    if (!data) return;

    data.spinner.stop();
    data.overlay.remove();

    spinnerMap.delete(container);
};
