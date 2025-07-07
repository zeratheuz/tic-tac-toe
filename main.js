const Gameboard = (function () {
  const rows = 4
  const columns = 4
  const gameboard = []

  for (let i = 0; i < rows; i++) {
    gameboard[i] = []
    for (let j = 0; j < columns; j++) {
      gameboard[i].push(Cell())
    } 
  }
})()