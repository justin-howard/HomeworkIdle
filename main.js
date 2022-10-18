var gameData = {
    homework: 0,
    homeworkPerClick: 1,
    homeworkPerClickCost: 10,
    lastTick: Date.now()
  }

  function update(id, content) {
    document.getElementById(id).innerHTML = content;
  }

  function completeHomework() {
    gameData.homework += gameData.homeworkPerClick
    document.getElementById("homeworkCompleted").innerHTML = gameData.homework + " Homework Completed"
  }

  function buyHomeworkPerClick() {
    if (gameData.homework >= gameData.homeworkPerClickCost) {
      gameData.homework -= gameData.homeworkPerClickCost
      gameData.homeworkPerClick += 1
      homeworkPerClickCost *= 2
      document.getElementById("homeworkCompleted").innerHTML = gameData.homework + " Homework Completed"
    document.getElementById("perClickUpgrade").innerHTML = "Upgrade Pencil (Currently Level " + gameData.homeworkPerClick + ") Cost: " + gameData.homeworkPerClickCost + " Homework"
    }
  }

  var mainGameLoop = window.setInterval(function() {
    diff = Date.now() - gameData.lastTick;
    gameData.lastTick = Date.now() // Don't forget to update lastTick.
    gameData.homework += gameData.homeworkPerClick * (diff / 1000) // divide diff by how often by the ms the loop is ran at
    document.getElementById("homeworkCompleted").innerHTML = gameData.homework + " Homework Completed"
  }, 1000)

  var savegame = JSON.parse(localStorage.getItem("homeworkIdleSave"))
  if (savegame !== null) {
    gameData = savegame
  }

  var saveGameLoop = window.setInterval(function() {
    localStorage.setItem("homeworkIdleSave", JSON.stringify(gameData))
  }, 15000)

  function format(number, type) {
	let exponent = Math.floor(Math.log10(number))
	let mantissa = number / Math.pow(10, exponent)
	if (exponent < 3) return number.toFixed(1)
	if (type == "scientific") return mantissa.toFixed(2) + "e" + exponent
	if (type == "engineering") return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + "e" + (Math.floor(exponent / 3) * 3)
}



if (typeof saveGame.homework !== "undefined") gameData.homework = saveGame.homework;
if (typeof saveGame.homeworkPerClick !== "undefined") gameData.homeworkPerClick = saveGame.homeworkPerClick;
if (typeof saveGame.homeworkPerClickCost !== "undefined") gameData.homeworkPerClickCost = saveGame.homeworkPerClickCost;
if (typeof saveGame.lastTick !== "undefined") gameData.lastTick = saveGame.lastTick;