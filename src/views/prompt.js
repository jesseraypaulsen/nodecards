import { render, qs, div, setPosition, centerPoint } from "./dom-helpers";

export default function promptView(controller) {
  const openPrompt = ({ x, y }) => {
    const prompt = div("creation-prompt");

    prompt.innerHTML = `<span>x</span><span>Create Card</span>`;

    render(prompt); //append must occur before setPosition

    setPosition(prompt, x, y);

    prompt.firstElementChild.addEventListener("click", () =>
      controller.close()
    );
    prompt.lastElementChild.addEventListener("click", (e) => {
      //const position = {}
      const position = centerPoint(e.target.parentElement);
      const id = Math.random().toString().substring(2, 9);
      const label = "new node";
      const text = "";
      const data = { id, label, text, position };
      controller.create(data);
    });
  };
  const closePrompt = () => {
    const prompt = qs(".creation-prompt");

    if (prompt) prompt.remove();
  };

  return { openPrompt, closePrompt };
}
