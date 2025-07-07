const Gameboard = (function () {
  const rows = 3
  const columns = 3
  const gameboard = []

  for (let i = 0; i < rows; i++) {
    gameboard[i] = []
    for (let j = 0; j < columns; j++) {
      gameboard[i].push(Cell())
    } 
  }

  const getGameboard = () => gameboard

  return {gameboard}
})()