import { render, qs, div, setPosition, centerPoint } from "./dom-helpers";

export default function promptViews(
  cardPromptController,
  linkPromptController
) {
  const openPrompt = ({ x, y }) => {
    const prompt = div("creation-prompt");

    prompt.innerHTML = `<span>x</span><span>Create Card</span>`;

    render(prompt); //append must occur before setPosition

    setPosition(prompt, x, y);

    prompt.firstElementChild.addEventListener("click", () =>
      cardPromptController.close()
    );
    prompt.lastElementChild.addEventListener("click", (e) => {
      const domPosition = centerPoint(e.target.parentElement);
      cardPromptController.create(domPosition);
    });
  };
  const closePrompt = () => {
    const prompt = qs(".creation-prompt");

    if (prompt) prompt.remove();
  };

  const openLinkPrompt = ({
    id,
    pointer: {
      DOM: { x, y },
    },
  }) => {
    const prompt = div("link-deletion-prompt");
    prompt.innerHTML = `<span>x</span><span>Remove link?</span>`;
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

  return { openPrompt, closePrompt, openLinkPrompt };
}
