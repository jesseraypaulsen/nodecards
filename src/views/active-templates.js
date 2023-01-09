// chooseActiveView
export default (controller) => (id, text, sendToMachine) => {
  const htmlText = (text) => {
    if (text) {
      return text
        .replace(/\n/g, "<br>")
        .replace(/\t/g, "&nbsp; &nbsp; &nbsp; &nbsp;");
    }
  };

  return {
    reader() {
      const reader = document.createElement("reader");
      reader.classList.add("reader");
      reader.innerHTML = htmlText(text);
      return reader;
    },

    editor() {
      const editor = document.createElement("textarea");
      editor.classList.add("editor");
      editor.value = text;
      editor.addEventListener("input", (e) => {
        controller(e, id);
      });

      return editor;
    },
  };
};
