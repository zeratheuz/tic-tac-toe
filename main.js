function Gameboard() {
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

  const dropToken = (row, column, playerToken) => {
    const availableCell = gameboard[row][column].getToken() === "#"

    if (!availableCell) return

    gameboard[row][column].addToken(playerToken)
  }

  const printGameboard = () => {
    const cellTokens = gameboard.map((cellRow) => cellRow.map((cell => cell.getToken())))
    console.table(cellTokens)
  }

  return { getGameboard, dropToken, printGameboard }
}

function Cell() {
  let token = "#"

  const addToken = (playerToken) => {
    token = playerToken
  }

  const getToken = () => token

  return {
    addToken,
    getToken
  }
}

function GameController(
  playerOneName = "One",
  playerTwoName = "Two") {
  const gameboard = Gameboard()

  const players = [
    {
      name: playerOneName,
      token: "X"
    },
    {
      name: playerTwoName,
      token: "O"
    }
  ]

  let activePlayer = players[0]

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]
  }
  const getActivePlayer = () => activePlayer

  const printNewRound = () => {
    gameboard.printGameboard()
    console.log(`${getActivePlayer().name}'s turn.`)
  }

  const playRound = (row, column) => {
    clear()
    console.log(`Dropping ${getActivePlayer().name}'s token into ${row}, ${column} position...`)
    gameboard.dropToken(row, column, getActivePlayer().token)
    const gameboardTokens = gameboard.getGameboard().map((cellRow) => cellRow.map((cell => cell.getToken()))).flat()

    const checkWin = (playerToken) => {
      const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ]

      for (let i = 0; i < winPatterns.length; i++) {
        let isWin = true

        for (let j = 0; j < winPatterns[i].length; j++) {
          let index = winPatterns[i][j]

          if (gameboardTokens[index] !== playerToken) {
            isWin = false
            break
          }
        }

        if (isWin) {
          return alert(`Player ${getActivePlayer().name} Wins!`)
        }
      }

      return console.log(`Nobody Wins`)
    }

    function checkTie() {
      let isTie = true
      gameboardTokens.forEach(token => {
        if (token === "#")
          isTie = false
      });
      
      if (isTie) {
        return alert("It's a tie!")
      }
      
      return false
    }

    checkTie()
    checkWin(getActivePlayer().token)
    switchPlayerTurn()
    printNewRound()
  }

  printNewRound()

  return {
    playRound,
    getActivePlayer,
    getGameboard: gameboard.getGameboard
  }
}