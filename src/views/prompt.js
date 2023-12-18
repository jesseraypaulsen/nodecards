import { render, qs, div, setPosition } from "./dom-helpers";
import "../../assets/styles/prompt.css";


export default function promptViews(linkPromptController) {
  const openLinkPrompt = ({
    id,
    pointer: {
      DOM: { x, y },
    },
  }) => {
    const prompt = div("link-deletion-prompt");
    // prompt.innerHTML = `<span>x</span><span>Remove link?</span>`;
    prompt.innerHTML = `<span>Remove link?</span>`;

    render(prompt);
    setPosition(prompt, x, y);

    prompt.lastElementChild.addEventListener("click", () =>
      linkPromptController.confirm(id)
    );

    // after the link prompt opens, any subsequent click event will close it.
    // clicking the "confirm" button will execute the effect AND close the prompt.
    // and there's no need for a "close" function. the "close" button is purely decorative.
    // this also prevents duplicate prompts from opening.
    // but without the time delay, the listener will close the prompt immediately after it opens.
    setTimeout(() => {
      document.addEventListener(
        "click",
        () => {
          qs(".link-deletion-prompt").remove();
        },
        { once: true }
      );
    }, 200);
  };

  return openLinkPrompt;
}
