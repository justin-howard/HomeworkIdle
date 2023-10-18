document.addEventListener("DOMContentLoaded", function () {
// Game data object
var gameData = {
  homework: 0,
  homeworkPerClick: 1,
  homeworkPerClickCost: 10,
  autoClickerLevel: 0,
  autoClickerCost: 50,
  gameLoopRunning: false,
  lastTick: null,
  theme: "Default", // New property for themes
  achievements: [], // New property for achievements
  superUpgrades: {
    pencilSharpener: {
      cost: 1000,
      multiplier: 2,
      purchased: false,
    },
    // Add more super upgrades as needed
  },
  prestigeLevel: 0, // New property for prestige
};

// Upgrade tree definition
const upgradeTree = {
  pathA: {
    upgrade1: {
      name: "Double Clicks",
      cost: 500,
      description: "Doubles the homework gained per manual click.",
      unlocked: false,
      effect: function () {
        gameData.homeworkPerClick *= 2;
      },
    },
    // Add more upgrades for pathA as needed
  },
  pathB: {
    upgrade2: {
      name: "Efficient Auto-Clicker",
      cost: 800,
      description: "Increases the efficiency of auto-clickers by 50%.",
      unlocked: false,
      effect: function () {
        gameData.autoClickerEfficiency *= 1.5;
      },
    },
    // Add more upgrades for pathB as needed
  },
  // Add more paths as needed
};

// Update the content of an element
function update(id, content) {
  document.getElementById(id).textContent = content;
}

// Format numbers without decimals and with commas
function format(number) {
  return Math.round(number).toLocaleString();
}

// Update all game-related elements
function updateAll() {
  update("homeworkCompleted", format(gameData.homework));
  update("perClickUpgrade", `Upgrade Pencil (Level ${gameData.homeworkPerClick}) Cost: ${format(gameData.homeworkPerClickCost)} Homework`);
  update("autoClickerUpgrade", `Buy Auto-Clicker (Cost: ${format(gameData.autoClickerCost)} Homework)`);
}

// Complete homework manually or automatically
function completeHomework() {
  gameData.homework += gameData.homeworkPerClick;
  updateAll();
  handleRandomEvent(); // Check for random events after completing homework
}

// Start the main game loop
function startMainGameLoop() {
  gameData.lastTick = Date.now();
  gameData.gameLoopRunning = true;
  setInterval(function () {
    var diff = Date.now() - gameData.lastTick;
    gameData.lastTick = Date.now();
    gameData.homework += gameData.autoClickerLevel * (diff / 1000);
    updateAll();
    handleRandomEvent(); // Check for random events in the main game loop
  }, 1000);
}

// Buy an upgrade to increase homework per click
function buyHomeworkPerClick() {
  if (gameData.homework >= gameData.homeworkPerClickCost) {
    gameData.homework -= gameData.homeworkPerClickCost;
    gameData.homeworkPerClick += 1;
    gameData.homeworkPerClickCost *= 2;
    updateAll();
  }
}

// Buy an auto-clicker upgrade
function buyAutoClicker() {
  if (gameData.homework >= gameData.autoClickerCost) {
    gameData.homework -= gameData.autoClickerCost;
    gameData.autoClickerLevel += 1;
    gameData.autoClickerCost = Math.ceil(gameData.autoClickerCost * 1.2);
    updateAll();
    console.log("Auto-clicker bought!"); // Add this line for debugging
    startMainGameLoop();
  }
}

// Reset the game progress
function resetGame() {
  if (confirm("Are you sure you want to reset your progress?")) {
    gameData = {
      homework: 0,
      homeworkPerClick: 1,
      homeworkPerClickCost: 10,
      autoClickerLevel: 0,
      autoClickerCost: 50,
      gameLoopRunning: false,
      lastTick: null,
      theme: "Default",
      achievements: [],
      superUpgrades: {
        pencilSharpener: {
          cost: 1000,
          multiplier: 2,
          purchased: false,
        },
      },
      prestigeLevel: 0,
    };
    updateAll();
  }
}

// Load saved game data from local storage
function loadGame() {
  var savedData = localStorage.getItem("homeworkIdleSave");
  if (savedData) {
    gameData = JSON.parse(savedData);
    updateAll();
    if (gameData.gameLoopRunning) {
      startMainGameLoop();
    }
  }
}

// Save game data to local storage
function saveGame() {
  console.log("Saving game..."); // Add this line for debugging
  localStorage.setItem("homeworkIdleSave", JSON.stringify(gameData));
}

// Function to change the theme
function changeTheme(selectedTheme) {
  gameData.theme = selectedTheme;

  // Add logic to update visuals based on the selected theme
  if (selectedTheme === "Dark") {
    document.body.style.backgroundColor = "#333";
    document.body.style.color = "#fff";
    // Add more styling for the dark theme as needed
  } else {
    // Reset to default styles
    document.body.style.backgroundColor = "#fff";
    document.body.style.color = "#000";
    // Add more styling for the default theme as needed
  }

  updateAll();
}

// Function to check and unlock achievements
function checkAchievements() {
  if (gameData.homework >= 100) {
    unlockAchievement("Aced 100!");
  }
  // Add more achievement checks as needed
}

// Function to purchase super upgrades
function purchaseSuperUpgrade(upgrade) {
  if (gameData.superUpgrades && gameData.superUpgrades[upgrade] && gameData.homework >= gameData.superUpgrades[upgrade].cost && !gameData.superUpgrades[upgrade].purchased) {
    gameData.homework -= gameData.superUpgrades[upgrade].cost;
    gameData.superUpgrades[upgrade].purchased = true;
    applySuperUpgradeEffect(upgrade);
    updateAll();
  }
}

// Function to apply the effect of a super upgrade
function applySuperUpgradeEffect(upgrade) {
  switch (upgrade) {
    case "pencilSharpener":
      gameData.homeworkPerClick *= gameData.superUpgrades[upgrade].multiplier;
      break;
    // Add more cases for other super upgrades
  }
}

// Display super upgrades on the page
function displaySuperUpgrades() {
  let superUpgradesList = document.getElementById("superUpgradesList");
  superUpgradesList.innerHTML = "";

  for (let upgrade in gameData.superUpgrades) {
    let upgradeInfo = gameData.superUpgrades[upgrade];
    let listItem = document.createElement("li");
    listItem.textContent = `${upgrade} (Cost: ${format(upgradeInfo.cost)} Homework) - ${upgradeInfo.purchased ? 'Purchased' : 'Not Purchased'}`;
    superUpgradesList.appendChild(listItem);
    if (!upgradeInfo.purchased) {
      let purchaseButton = document.createElement("button");
      purchaseButton.textContent = "Purchase";
      purchaseButton.addEventListener("click", function () {
        purchaseSuperUpgrade(upgrade);
      });
      listItem.appendChild(purchaseButton);
    }
  }
}


// Function to reset the game progress and gain prestige bonus
function prestige() {
  if (confirm("Are you sure you want to prestige?")) {
    gameData.prestigeLevel += 1;
    let prestigeBonus = 1 + 0.1 * gameData.prestigeLevel; // 10% bonus per prestige level
    gameData = {
      homework: 0,
      homeworkPerClick: gameData.homeworkPerClick * prestigeBonus,
      homeworkPerClickCost: 10,
      autoClickerLevel: 0,
      autoClickerCost: 50,
      gameLoopRunning: false,
      lastTick: null,
      theme: gameData.theme,
      achievements: [],
      superUpgrades: {
        pencilSharpener: {
          cost: 1000,
          multiplier: 2,
          purchased: false,
        },
        // Add more super upgrades as needed
      },
      prestigeLevel: gameData.prestigeLevel,
    };
    updateAll();
  }
}

// Function to handle random events
function handleRandomEvent() {
  let chance = Math.random();

  if (chance < 0.002) { // 1 out of 500
    let eventType = Math.random() < 0.5 ? "positive" : "negative";

    if (eventType === "positive") {
      gameData.homework *= 2;
      showNotification("Double homework completion for a short duration!");
    } else {
      let lostHomework = Math.floor(gameData.homework * 0.2); // Lose 20%
      gameData.homework -= lostHomework;
      showNotification(`You lost ${format(lostHomework)} homework in a mishap!`);
    }

    updateAll();
  }
}

// Function to show notifications
function showNotification(message) {
  let notificationContainer = document.getElementById("notificationContainer");
  let notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  notificationContainer.appendChild(notification);

  // Automatically remove the notification after 10 seconds
  setTimeout(() => {
    notification.remove();
  }, 10000);
}

// Add event listeners to buttons
document.getElementById("completeHomeworkButton").addEventListener("click", completeHomework);
document.getElementById("perClickUpgradeButton").addEventListener("click", buyHomeworkPerClick);
document.getElementById("autoClickerUpgradeButton").addEventListener("click", buyAutoClicker);
document.getElementById("resetGameButton").addEventListener("click", resetGame);

// Load saved game data on page load
window.addEventListener("load", loadGame);

// Save game data periodically
setInterval(saveGame, 15000);

// Add event listener for the saveGameButton
document.getElementById("saveGameButton").addEventListener("click", function () {
  saveGame();
});

// Additional event listeners for new functionalities
document.getElementById("themeDropdown").addEventListener("change", function (event) {
  changeTheme(event.target.value);
});

document.getElementById("purchaseSuperUpgradeButton").addEventListener("click", function () {
  purchaseSuperUpgrade("pencilSharpener"); // Change the upgrade name as needed
});

document.getElementById("prestigeButton").addEventListener("click", prestige);

// Function to purchase regular upgrades
function purchaseUpgrade(path, upgrade) {
  const upgradeInfo = upgradeTree[path][upgrade];
  if (gameData.homework >= upgradeInfo.cost && !upgradeInfo.unlocked) {
    gameData.homework -= upgradeInfo.cost;
    upgradeInfo.unlocked = true;
    upgradeInfo.effect();
    updateAll();
  }
}

// Function to display regular upgrades on the page
function displayUpgrades() {
  let upgradeTreeContainer = document.getElementById("upgradeTree");
  upgradeTreeContainer.innerHTML = "<h2>Upgrade Tree</h2>";

  for (let path in upgradeTree) {
    let pathUpgrades = upgradeTree[path];
    let pathHeader = document.createElement("h3");
    pathHeader.textContent = path;
    upgradeTreeContainer.appendChild(pathHeader);

    for (let upgrade in pathUpgrades) {
      let upgradeInfo = pathUpgrades[upgrade];
      let listItem = document.createElement("li");
      listItem.textContent = `${upgradeInfo.name} (Cost: ${format(upgradeInfo.cost)} Homework) - ${upgradeInfo.unlocked ? 'Unlocked' : 'Locked'}: ${upgradeInfo.description}`;
      upgradeTreeContainer.appendChild(listItem);
      let purchaseButton = document.createElement("button");
      purchaseButton.textContent = "Purchase";
      purchaseButton.addEventListener("click", function () {
        purchaseUpgrade(path, upgrade);
      });
      listItem.appendChild(purchaseButton);
    }
  }
}

// Update all game-related elements
function updateAll() {
  update("homeworkCompleted", format(gameData.homework));
  update("perClickUpgrade", `Upgrade Pencil (Level ${gameData.homeworkPerClick}) Cost: ${format(gameData.homeworkPerClickCost)} Homework`);
  update("autoClickerUpgrade", `Buy Auto-Clicker (Cost: ${format(gameData.autoClickerCost)} Homework)`);
  displaySuperUpgrades();
  displayUpgrades(); // Display regular upgrades on the page
}
});