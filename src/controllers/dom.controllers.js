
export function domControllers(send) {

  // for edit
  const editor = (e, id) => {
    send({ type: "CARD.EDIT.TYPING", text: e.target.value, id })
  }

  // TODO: put switch panel controllers into separate file?

  const panel = {
    userEvent: (type) => ({ type, sentByUser: true }),
  
    physics: (e) => {
      const chkValue = e.target.checked;
      chkValue ? send(panel.userEvent('turnPhysicsOn')) : send(panel.userEvent('turnPhysicsOff'));
    },
  
    persist: (e) => {
      const chkValue = e.target.checked;
      chkValue ? send('PERSIST.ON') : send('PERSIST.OFF');
    },
  
    select: (e) => {
      send(panel.userEvent(e.target.value))
    }
  }

  const buttons = {
    edit: (id) => send({ type: "CARD.EDIT", id }),
    read: (id) => send({ type: "CARD.READ", id }),
    delete: (id) => send({ type: "CARD.DELETE", id }),
    inertify: (id) => send({ type: "CARD.INERTIFY", id }),
  }

  return { editor, panel, buttons }
}

