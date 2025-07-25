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
    const availableCell = gameboard[row][column].getToken() === " "

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
  let token = " "

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

  let isWinner = false
  let isTie = false

  const getIsWinner = () => isWinner
  const getIsTie = () => isTie

  const playRound = (row, column) => {
    const isAvailable = gameboard.getGameboard()[row][column].getToken() === " "
    if (!isWinner && !isTie) gameboard.dropToken(row, column, getActivePlayer().token)
    const gameboardTokens = gameboard.getGameboard().map((cellRow) => cellRow.map((cell => cell.getToken())))
    const gameboardTokensFlat = gameboardTokens.flat()

    function checkWin(playerToken) {
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

          if (gameboardTokensFlat[index] !== playerToken) {
            isWin = false
            break
          }
        }

        if (isWin) {
          return true
        }
      }

      return false
    }

    function checkTie() {
      let isTie = true
      gameboardTokensFlat.forEach(token => {
        if (token === " ")
          isTie = false
      });

      if (isTie) {
        return true
      }

      return false
    }

    function checkAvailable() {
      if (isAvailable) {
        console.log(`Dropping ${getActivePlayer().name}'s token into ${row}, ${column} position...`)
        switchPlayerTurn()
      }
    }

    if (checkWin(getActivePlayer().token)) {
      isWinner = true
    } else if (checkTie()) {
      isTie = true
    } else {
      checkAvailable()
      printNewRound()
    }


  }

  printNewRound()

  return {
    getIsTie,
    playRound,
    getIsWinner,
    getActivePlayer,
    getGameboard: gameboard.getGameboard
  }
}

function ScreenController(playerOne, playerTwo) {
  const game = GameController(playerOne, playerTwo)
  const gameturnDiv = document.querySelector(".gameturn")
  const gameboardDiv = document.querySelector(".gameboard")
  const restartButton = document.createElement("button")
  restartButton.innerText = "Restart?"
  restartButton.classList.add("restart")
  restartButton.addEventListener("click", ScreenController(players.playerOne, players.playerTwo))

  const updateScreen = () => {
    gameboardDiv.textContent = ""

    const gameboard = game.getGameboard()
    const activePlayer = game.getActivePlayer().name
    const isTie = game.getIsTie()
    const isWinner = game.getIsWinner()

    if (!isWinner && !isTie) {
      gameturnDiv.textContent = `${activePlayer}'s turn...`
    } else if (isWinner) {
      gameturnDiv.textContent = `${activePlayer} WINS!`
      if (!gameturnDiv.querySelector('.restart')) {
        gameturnDiv.appendChild(restartButton)
      }
    } else if (isTie) {
      gameturnDiv.textContent = `It's a Tie! `
      if (!gameturnDiv.querySelector('.restart')) {
        gameturnDiv.appendChild(restartButton)
      }
    }

    gameboard.forEach((row, index) => {
      const rowIndex = index

      row.forEach((cell, index) => {
        const columnIndex = index

        const cellButton = document.createElement("button")
        cellButton.classList.add("cell")
        cellButton.dataset.row = rowIndex
        cellButton.dataset.column = columnIndex
        cellButton.textContent = cell.getToken()
        gameboardDiv.appendChild(cellButton)
      })
    })
  }

  function clickHandlerGameboard(e) {
    const selectedRow = e.target.dataset.row
    const selectedCol = e.target.dataset.column

    if (!selectedRow || !selectedCol) return

    game.playRound(selectedRow, selectedCol)
    updateScreen()
  }
  gameboardDiv.addEventListener("click", clickHandlerGameboard)

  updateScreen()

}

let players

const getPlayers = (function () {
  const containerDialog = document.querySelector("#containerDialog")
  containerDialog.showModal()

  const form = document.querySelector("#players")
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const playersData = new FormData(form)
    players = Object.fromEntries(playersData.entries())
    ScreenController(players.playerOne, players.playerTwo)
    containerDialog.close()
  })

})()