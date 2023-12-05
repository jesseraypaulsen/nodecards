
// highlight the card that the link originates from
export const startHighlightingSourceCard = (id) => {
  const fromCard = Array.from(container.querySelectorAll(".nodecard")).find(el => el.dataset.id == id)
  fromCard.classList.add('linking-from')
}

// remove the highlight from the card that originated the link
export const stopHighlightingSourceCard = (from) => {
  const fromCard = Array.from(container.querySelectorAll(".nodecard")).find(el => el.dataset.id == from)
  if (fromCard && fromCard.classList.contains('linking-from')) fromCard.classList.remove('linking-from')
}