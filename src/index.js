require("dotenv").config()
const { Client, IntentsBitField, PermissionsBitField, ActivityType, EmbedBuilder, Embed } = require('discord.js')
//const sqlite3 = require("sqlite3").verbose()
const mysql = require("mysql")
const fs = require('fs')

var servers = ["1061252848446361660", "647540631367057429", "675732197839339610"];

/*



// Connect to MySQL-DB

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'EconomyBot',
    password: 'pwd',
    database: 'economy_bot'
})





// Database Query

await new Promise((resolve, reject) => {
            pool.getConnection( (error, connection) => {
                if(error) throw error
                connection.query(`SELECT job FROM player WHERE UserID = ?`, [UserID], (err, rows) => {
                    connection.release()
                    if (err) return reject();
                    job = rows[0].job
                    resolve();
                })
            })
        });



*/
var Server = []

// Player-Item: UserID, ItemTag, Amount, Durability
var PlayerItem = []

// Item: ItemTag, Price, Stockpile, Producible, Ingredients, Worksteps
var Item = []

// Company: EntrepreneurID, Workers, ProducibleItems, Capital, Wage, Name, PaymentOption, JoinRequests, Worksteps
var Company = []

// Company-Item: Entrepreneur-ID, ItemTag, Amount
var CompanyItem = []

// Player: UserID, Money, Debt, Hunger, Thirst, Job
var Player = []

var workCooldown = []
var ccCooldown = [] //cc = CompanyCreation
var giftCooldown = []
var jobCooldown = []
var saveCooldown = []

function getRandomNumberBetween(a, b) {
    // Swap the values of a and b if a is greater than b
    if (a > b) {
      [a, b] = [b, a];
    }
  
    // Calculate the random value between a and b (inclusive)
    const randomValue = Math.floor(Math.random() * (b - a + 1)) + a;
  
    return randomValue;
  }

const getPlayerData = (guildID) => {
    const playerData = 'data/' + guildID + '/players.json';
    const data = fs.readFileSync(playerData, "utf-8");
    PlayerJSON = JSON.parse(data);
    if (Object.keys(PlayerJSON).length === 0) {
        // If data is empty
        return
    }

    for (const player of PlayerJSON) {
        Player.push(Object.values(player))
        
    }

}

const getPlayerItemData = (guildID) => {
    const playerItemData = 'data/' + guildID + '/playerItems.json';
    const data = fs.readFileSync(playerItemData, "utf-8");
    PlayerItemJSON = JSON.parse(data);
    if (Object.keys(PlayerItemJSON).length === 0) {
        // If data is empty
        return
    }

    for (const playerItem of PlayerItemJSON) {
        PlayerItem.push(Object.values(playerItem))
    }
}

const getItemData = (guildID) => {
    const path = 'data/' + guildID + '/items.json';
    const data = fs.readFileSync(path, "utf-8");
    ObjectJSON = JSON.parse(data);
    if (Object.keys(ObjectJSON).length === 0) {
        // If data is empty
        return
    }
    for (const e of ObjectJSON) {
        Item.push(Object.values(e))
    }
    for (let i = 0; i < Item.length; i++) {
        items.push(Item[i][0])
        if (Item[i][3] == 1) {
            produceable_items.push(Item[i][0])
        }
    }
}

const getCompanyData = (guildID) => {
    const path = 'data/' + guildID + '/companies.json';
    const data = fs.readFileSync(path, "utf-8");
    ObjectJSON = JSON.parse(data);
    if (Object.keys(ObjectJSON).length === 0) {
        // If data is empty
        return
    }

    for (const e of ObjectJSON) {
        Company.push(Object.values(e))
    }

}

const getCompanyItemData = (guildID) => {
    const path = 'data/' + guildID + '/companyItems.json';
    const data = fs.readFileSync(path, "utf-8");
    ObjectJSON = JSON.parse(data);
    if (Object.keys(ObjectJSON).length === 0) {
        // If data is empty
        return
    }

    for (const e of ObjectJSON) {
        CompanyItem.push(Object.values(e))
    }
}

function getServerIndex(guildID) {
    var serverIndex;
    for (let s = 0; s < servers.length; s++) {
        if (servers[s] === guildID) {
            //console.log("Found server! Index: " + s)
            serverIndex = s
            return serverIndex
        }
    }
    if (serverIndex === undefined || serverIndex === null) {
        console.log("[002] Server not found error!")
        return false
    }
    if (Server[serverIndex] === undefined) {
        console.log("[001] Server undefined error!")
        return false
    }
}

function savePlayerData(guildID) {
    var serverIndex = getServerIndex(guildID)
    const jsonDataArray = Server[serverIndex][1].map((innerArray) => {
        return {
          playerID: innerArray[0],
          money: innerArray[1],
          debt: innerArray[2],
          hunger: innerArray[3],
          thirst: innerArray[4],
          job: innerArray[5]
        };
      });
      
      const jsonData = JSON.stringify(jsonDataArray, null, 2);
      const path = 'data/' + guildID + '/players.json';
      
      fs.writeFile(path, jsonData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('Data saved successfully!');
        }
      });

      return jsonData
}

function savePlayerItemData(guildID) {
    var serverIndex = getServerIndex(guildID)
    const jsonDataArray = Server[serverIndex][2].map((innerArray) => {
        return {
          id: innerArray[0],
          itemTag: innerArray[1],
          amount: innerArray[2],
          durability: innerArray[3]
        };
      });
      
      const jsonData = JSON.stringify(jsonDataArray, null, 2);
      const path = 'data/' + guildID + '/playerItems.json';
      
      fs.writeFile(path, jsonData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('Data saved successfully!');
        }
      });

      return jsonData
}

function saveItemData(guildID) {
    var serverIndex = getServerIndex(guildID)
    const jsonDataArray = Server[serverIndex][3].map((innerArray) => {
        return {
          itemTag: innerArray[0],
          price: innerArray[1],
          stockpile: innerArray[2],
          producible: innerArray[3],
          ingredients: innerArray[4],
          worksteps: innerArray[5]
        };
      });
      
      const jsonData = JSON.stringify(jsonDataArray, null, 2);
      const path = 'data/' + guildID + '/items.json';
      
      fs.writeFile(path, jsonData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('Data saved successfully!');
        }
      });

      return jsonData
}

function saveCompanyData(guildID) {
    var serverIndex = getServerIndex(guildID)
    const jsonDataArray = Server[serverIndex][4].map((innerArray) => {
        return {
          entrepreneurID: innerArray[0],
          workers: innerArray[1],
          producibleItems: innerArray[2],
          capital: innerArray[3],
          wage: innerArray[4],
          name: innerArray[5],
          paymentOption: innerArray[6],
          joinRquests: innerArray[7],
          worksteps: innerArray[8]
        };
      });
      
      const jsonData = JSON.stringify(jsonDataArray, null, 2);
      const path = 'data/' + guildID + '/companies.json';
      
      fs.writeFile(path, jsonData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('Data saved successfully!');
        }
      });

      return jsonData
}


function saveCompanyItemData(guildID) {
    var serverIndex = getServerIndex(guildID)
    const jsonDataArray = Server[serverIndex][5].map((innerArray) => {
        return {
          entrepreneurID: innerArray[0],
          itemTag: innerArray[1],
          amount: innerArray[2]
        };
      });
      
      const jsonData = JSON.stringify(jsonDataArray, null, 2);
      const path = 'data/' + guildID + '/companyItems.json';
      
      fs.writeFile(path, jsonData, 'utf8', (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('Data saved successfully!');
        }
      });

      return jsonData
}


function doIntervalPayment() {
    if (Company.length === 0) {
        return;
    }
    for (let i = 0; i < Company.length; i++) {
        if (Company[i][6] === "interval" && Company[i][1].length > 0) {
            console.log("Paying employees!")
            for (let w = 0; w < Company[i][1].length; w++) {
                let workerIndex = getPlayerIndexByID(Company[i][1][w])
                if (Company[i][3] > Company[i][4]) { // If the company has enough money to pay their workers
                    Company[i][3] -= Company[i][4]
                    Player[workerIndex][1] += Company[i][4]
                }
            }
        }
    }
}

function increaseDebt() {
    if (Player.length === 0) {
        return;
    }
    for (let i = 0; i < Player.length; i++) {
        Player[i][2] *= 1.1
        if (Player[i][2] > 100000) {
            Player[i][2] = 100000
        }
    }
    console.log("Increased debt!")
}



const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildPresences
    ]
});

var items = [] 
var produceable_items = [] 




var idWithName = [];

// Function to remove duplicate entries based on username
const removeDuplicates = (list) => {
    const uniqueItems = new Map();
    list.forEach((item) => {
      const [userId, username] = item;
      if (!uniqueItems.has(userId)) {
        uniqueItems.set(userId, username);
      }
    });
    return Array.from(uniqueItems.entries());
  };
  
  

exports.run =  async () => {
    
    console.log("🖥️  Registering Usernames And IDs...")
    
    //console.log(idWithName);
    console.log("🖥️ ✅ Registered Usernames And IDs!")
    for (let i = 0; i < servers.length; i++) {
        const list = client.guilds.cache.get(servers[i]);
        const members = await list.members.fetch();
        members.each((member) => {
            //console.log(member.user.id + " " + member.user.username);
            idWithName.push([member.user.id,member.user.username]);
        })
        getPlayerData(servers[i]);
        getPlayerItemData(servers[i]);
        getItemData(servers[i]);
        getCompanyData(servers[i]);
        getCompanyItemData(servers[i]);
        Server.push([servers[i], Player, PlayerItem, Item, Company, CompanyItem])

        

        Player = []
        PlayerItem = []
        Item = []
        Company = []
        CompanyItem = []


    }
    
    
    //getServerData(process.env.GUILD_ID);

    

    
}


function getPlayerIndex(interaction) {
    const UserID = interaction.user.id;
    for (let i = 0; i < Player.length; i++) {
        if (Player[i][0] === UserID) {
            // Found the player at position i
            return i;
        }
    }
    // The player is not yet existent in the database: Makes a new entry
    Player.push([UserID, 100.0, 0.0, 100, 100, ""])
    return (Player.length - 1)
}

function getPlayerIndexByID(userID) {
    for (let i = 0; i < Player.length; i++) {
        if (Player[i][0] === userID) {
            // Found the player at position i
            return i;
        }
    }
    // The player is not yet existent in the database: Makes a new entry
    Player.push([userId, 100.0, 0.0, 100, 100, ""])
    return (Player.length - 1)
}

function work(userIndex) { // Makes the user hungry
    hungerLoss = getRandomNumberBetween(5,15)
    thirstLoss = getRandomNumberBetween(10,20)
    Player[userIndex][3] -= hungerLoss
    Player[userIndex][4] -= thirstLoss
    if (Player[userIndex][3] < 0) Player[userIndex][3] = 0;
    if (Player[userIndex][4] < 0) Player[userIndex][4] = 0;

}

function getPlayerItemIndex(userIndex, itemTag) {
    for (let i = 0; i < PlayerItem.length; i++) {
        if (PlayerItem[i][0] === Player[userIndex][0] && PlayerItem[i][1].toLowerCase() === itemTag.toLowerCase()) { //If the UserID and the ItemTag match
            // The Player-Item already exists: The player does have that item in his inventory
            console.log("Found " + itemTag + " at index " + i)
            return i;
        }
        
    }
    // The Player-Item does not exist yet: The player does NOT have that item in his inventory
    let durability = 1
    if (itemTag.toLowerCase() === "Pickaxe".toLowerCase()) durability = 35
    if (itemTag.toLowerCase() === "Mining Machine".toLowerCase()) durability = 90
    if (itemTag.toLowerCase() === "Fertilizer".toLowerCase()) durability = 20
    if (itemTag.toLowerCase() === "Tractor".toLowerCase()) durability = 60
    if (itemTag.toLowerCase() === "Axe".toLowerCase()) durability = 2
    if (itemTag.toLowerCase() === "Chainsaw".toLowerCase()) durability = 70
    if (itemTag.toLowerCase() === "Water Cleaning".toLowerCase()) durability = 150
    if (itemTag.toLowerCase() === "Gas Pipeline".toLowerCase()) durability = 150
    if (itemTag.toLowerCase() === "Oil Drilling Machine".toLowerCase()) durability = 150
    if (itemTag.toLowerCase() === "Tool".toLowerCase()) durability = 25
    PlayerItem.push([Player[userIndex][0],itemTag,0,durability])
    console.log("Made new stack! Index: " + (PlayerItem.length - 1))
    return (PlayerItem.length - 1)
}

function getItemIndex(itemTag) {
    for (let i = 0; i < Item.length; i++) {
        if (Item[i][0].toLowerCase() === itemTag.toLowerCase()) {
            return i;
        }
    }
    console.log("Couldn't find the item " + itemTag)
}

function hasItem(userIndex, itemTag, amount) {
    for (let i = 0; i < PlayerItem.length; i++) {
        if (PlayerItem[i][0] === Player[userIndex][0] && PlayerItem[i][1].toLowerCase() === itemTag.toLowerCase() && PlayerItem[i][2] >= amount) { //If the UserID and the ItemTag match as well as the amount
            // The Player-Item already exists: The player does have that item in his inventory
            return true;
        }
        // The Player-Item does not exist
        
    }
    return false;
}

function addItem(userIndex, itemTag, amount) {
    piIndex = getPlayerItemIndex(userIndex, itemTag);
    PlayerItem[piIndex][2] += amount
    console.log("Added item!")
}

function removeItem(userIndex, itemTag, amount) {
    piIndex = getPlayerItemIndex(userIndex, itemTag);
    PlayerItem[piIndex][2] -= amount
    if (PlayerItem[piIndex][2] <= 0) {
        PlayerItem.splice(piIndex, 1)
    }
}

function getCompanyItemIndex(companyIndex, itemTag) {
    for (let i = 0; i < CompanyItem.length; i++) {
        if (CompanyItem[i][0] === Company[companyIndex][0] && CompanyItem[i][1].toLowerCase() === itemTag.toLowerCase()) { //If the EntrepreneurID and the ItemTag match
            // The Company-Item already exists: The company does have that item in their stockpile
            return i;
        }
        
    }
    // The Company-Item does not exist yet: The company does NOT have that item in their stockpile
    CompanyItem.push([Company[companyIndex][0],itemTag,0])
    return (CompanyItem.length - 1)
}

function companyHasItem(companyIndex, itemTag, amount) {
    for (let i = 0; i < CompanyItem.length; i++) {
        console.log("Do we have " + amount + "x " + itemTag + "? We have " + CompanyItem[i][2] + "x " + CompanyItem[i][1])
        if (CompanyItem[i][0] === Company[companyIndex][0] && CompanyItem[i][1].toLowerCase() === itemTag.toLowerCase() && CompanyItem[i][2] >= amount) { //If the EntrepreneurID and the ItemTag match as well as the amount
            // The Company-Item already exists: The company does have that item in their stockpile
            console.log("Indeed we have it!")
            return true;
        }
        // The Company-Item does not exist
        
    }
    console.log("Nope we don't have " + itemTag)
    return false;
}

function companyAddItem(companyIndex, itemTag, amount) {
    
    ciIndex = getCompanyItemIndex(companyIndex, itemTag);
    CompanyItem[ciIndex][2] += amount
}

function companyRemoveItem(companyIndex, itemTag, amount) {
    ciIndex = getCompanyItemIndex(companyIndex, itemTag);
    CompanyItem[ciIndex][2] -= amount
    if (CompanyItem[ciIndex][2] <= 0) {
        CompanyItem.splice(ciIndex, 1)
        
    }
    console.log("Removed " + amount + "x " + itemTag)
}

function useItem(userIndex, itemTag) { // Removes 1 durability from an item
    piIndex = getPlayerItemIndex(userIndex, itemTag);
    PlayerItem[piIndex][3] -= 1
    let durability = PlayerItem[piIndex][3]
    if (PlayerItem[piIndex][3] <= 0) {
        removeItem(userIndex, itemTag.toLowerCase(), 1)
        let durability = 0
        if (itemTag.toLowerCase() === "Pickaxe".toLowerCase()) durability = 35
        if (itemTag.toLowerCase() === "Mining Machine".toLowerCase()) durability = 90
        if (itemTag.toLowerCase() === "Fertilizer".toLowerCase()) durability = 20
        if (itemTag.toLowerCase() === "Tractor".toLowerCase()) durability = 60
        if (itemTag.toLowerCase() === "Axe".toLowerCase()) durability = 2
        if (itemTag.toLowerCase() === "Chainsaw".toLowerCase()) durability = 70
        if (itemTag.toLowerCase() === "Water Cleaning".toLowerCase()) durability = 150
        if (itemTag.toLowerCase() === "Gas Pipeline".toLowerCase()) durability = 150
        if (itemTag.toLowerCase() === "Oil Drilling Machine".toLowerCase()) durability = 150
        if (itemTag.toLowerCase() === "Tool".toLowerCase()) durability = 25
    }
    return durability
}

function getItemPrice (itemTag) {
    for (let i = 0; i < Item.length; i++) {
        if (Item[i][0].toLowerCase() === itemTag.toLowerCase()) {
            return Item[i][1]; // Returns the price
        }
    }
    console.log("Couldn't find the item " + itemTag + "!")
}

function getItemStockpile (itemTag) {
    for (let i = 0; i < Item.length; i++) {
        if (Item[i][0].toLowerCase() === itemTag.toLowerCase()) {
            return Item[i][2]; // Returns the price
        }
    }
    console.log("Couldn't find the item " + itemTag + "!")
}

function getCompanyIndex (userIndex) {
    for (let i = 0; i < Company.length; i++) {
        if (Company[i][0] === Player[userIndex][0]) { // Company belongs to player
            return i;
        }
    }
    console.log("Couldn't find company!")
    return false;
}

function buyItem (userIndex, itemTag, amount) { // Does not include a check for if the player has enough money to buy the item NOR for if there are enough items available
    for (let i = 0; i < Item.length; i++) {
        if (Item[i][0].toLowerCase() === itemTag.toLowerCase()) {
            const increasePercentage = 0.01
            const decreasePercentage = 0.001
            const price = Item[i][1]
            const scalingFactor = price / 1000
            var payedPrice = 0

            addItem(userIndex, itemTag, amount)
            
            for (let a = 0; a < amount; a++) {
                payedPrice += Item[i][1] // Paying for the item
                Item[i][2] -= 1 // Removing one item from the stockpile
                
                Item[i][1] *= (1 + increasePercentage * scalingFactor) // Increase the price of the purchased item

                for (let j = 0; j < Item.length; j++) {
                    if (Item[j][0].toLowerCase() != itemTag.toLowerCase()) { // Decrease the price of all other items
                        Item[j][1] *= (1 - decreasePercentage * scalingFactor)
                    }
                }

            }

            Player[userIndex][1] -= payedPrice

            let newprice = Item[i][1]
            console.log("$" + price + " -> $" + newprice)
            return;

            
        }
    }
}

function getBuyPrice(itemTag, amount) { // Simulates buying an item from the market to get the amount of money it would cost
    itemIndex = getItemIndex(itemTag)
    const increasePercentage = 0.01
    var itemPrice = Item[itemIndex][1]
    const scalingFactor = itemPrice / 100
    var payedPrice = 0

    for (let a = 0; a < amount; a++) {
        payedPrice += itemPrice // Paying for the item
        itemPrice *= (1 + increasePercentage * scalingFactor) // Increasing the price of the item
    }

    return payedPrice

}

function getSellPrice(itemTag, amount) { // Simulates selling an item to the market to get the amount of money it would yield
    itemIndex = getItemIndex(itemTag)
    const decreasePercentage = 0.01
    var itemPrice = Item[itemIndex][1]
    const scalingFactor = itemPrice / 100
    var payedPrice = 0

    for (let a = 0; a < amount; a++) {
        payedPrice += itemPrice // Paying for the item
        itemPrice *= (1 - decreasePercentage * scalingFactor) // Increasing the price of the item
    }

    return payedPrice

}

function sellItem(userIndex, itemTag, amount) { // Does not include a check for if the player has enough of those items
    itemIndex = getItemIndex(itemTag)
    const decreasePercentage = 0.01
    const increasePercentage = 0.001
    const price = Item[itemIndex][1]
    const scalingFactor = price / 1000
    var payedPrice = 0

    removeItem(userIndex, itemTag, amount)    

    for (let a = 0; a < amount; a++) {
        payedPrice += Item[itemIndex][1]
        Item[itemIndex][2] += 1 // Adding one item to the stockpile
        Item[itemIndex][1] *= (1 - decreasePercentage * scalingFactor) // Increase the price of the purchased item

        for (let j = 0; j < Item.length; j++) {
            if (Item[j][0].toLowerCase() != itemTag.toLowerCase()) { // Decrease the price of all other items
                Item[j][1] *= (1 + increasePercentage * scalingFactor)
            }
        }
        

    }

    let newprice = Item[itemIndex][1]
    console.log("$" + price + " -> $" + newprice)
       
    Player[userIndex][1] += payedPrice
    return;


}

function companyBuyItem (companyIndex, itemTag, amount) { // Does not include a check for if the player has enough money to buy the item NOR for if there are enough items available
    for (let i = 0; i < Item.length; i++) {
        if (Item[i][0].toLowerCase() === itemTag.toLowerCase()) {
            const increasePercentage = 0.01
            const decreasePercentage = 0.001
            const price = Item[i][1]
            const scalingFactor = price / 1000
            var payedPrice = 0

            companyAddItem(companyIndex, itemTag, amount)
            
            for (let a = 0; a < amount; a++) {
                payedPrice += Item[i][1] // Paying for the item
                Item[i][2] -= 1 // Removing one item from the stockpile
                

                Item[i][1] *= (1 + increasePercentage * scalingFactor) // Increase the price of the purchased item

                for (let j = 0; j < Item.length; j++) {
                    if (Item[j][0].toLowerCase() != itemTag.toLowerCase()) { // Decrease the price of all other items
                        Item[j][1] *= (1 - decreasePercentage * scalingFactor)
                    }
                }

            }

            Company[companyIndex][3] -= payedPrice

            let newprice = Item[i][1]
            console.log("$" + price + " -> $" + newprice)
            return;

            
        }
    }
}

function companySellItem(companyIndex, itemTag, amount) { // Does not include a check for if the player has enough of those items
    itemIndex = getItemIndex(itemTag)
    const decreasePercentage = 0.01
    const increasePercentage = 0.001
    const price = Item[itemIndex][1]
    const scalingFactor = price / 1000
    var payedPrice = 0

    companyRemoveItem(companyIndex, itemTag, amount)    

    for (let a = 0; a < amount; a++) {
        payedPrice += Item[itemIndex][1]
        Item[itemIndex][2] += 1 // Adding one item to the stockpile
        Item[itemIndex][1] *= (1 - decreasePercentage * scalingFactor) // Increase the price of the purchased item

        for (let j = 0; j < Item.length; j++) {
            if (Item[j][0].toLowerCase() != itemTag.toLowerCase()) { // Decrease the price of all other items
                Item[j][1] *= (1 + increasePercentage * scalingFactor)
            }
        }
        

    }

    let newprice = Item[itemIndex][1]
    console.log("$" + price + " -> $" + newprice)
       
    Company[companyIndex][3] += payedPrice
    return;


}

function getIngredients(itemTag) {
    var itemIndex = getItemIndex(itemTag)
    return Item[itemIndex][4]
}

function synchronizeServerData(guildID) {
    var serverIndex;
    for (let s = 0; s < servers.length; s++) {
        if (servers[s] === guildID) {
            //console.log("Found server! Index: " + s)
            serverIndex = s
        }
    }
    if (serverIndex === undefined || serverIndex === null) {
        console.log("Didn't find server! 111")
        return
    }

    Server[serverIndex][1] = Player
    Server[serverIndex][2] = PlayerItem
    Server[serverIndex][3] = Item
    Server[serverIndex][4] = Company
    Server[serverIndex][5] = CompanyItem
    console.log("Synchronized Data!")
    
}

const prefix = "/";

function saveAll() {
    for (let i = 0; i < servers.length; i++) {
        savePlayerData(servers[i])
        savePlayerItemData(servers[i])
        saveItemData(servers[i])
        saveCompanyData(servers[i])
        saveCompanyItemData(servers[i])

        }
    console.log("Saved the game")
}

client.on("ready", (c) => {
    
    exports.run();
    console.log(`📈✅ The Economy Is Ready!`);
    client.user.setActivity({
        name: "the Economy",
        type: ActivityType.Watching
    })

    setInterval(increaseDebt, 3600000);
    setInterval(doIntervalPayment, 3600000);
    setInterval(saveAll,300000)


    

});

client.on('interactionCreate', async (interaction) =>  {
    if (!interaction.isChatInputCommand()) return;

    // Getting the data depending on the server
    var serverIndex;
    for (let s = 0; s < servers.length; s++) {
        if (servers[s] === interaction.guild.id) {
            //console.log("Found server! Index: " + s)
            serverIndex = s
        }
    }
    if (serverIndex === undefined || serverIndex === null) {
        console.log("Didn't find server! 000")
        
        interaction.reply("[002] Server not found error!")
        return
    }
    if (Server[serverIndex] === undefined) {
        console.log("Server " + serverIndex + " is undefined!")
        interaction.reply("[001] Server undefined error!")
        return
    }
    Player = Server[serverIndex][1]
    PlayerItem = Server[serverIndex][2]
    Item = Server[serverIndex][3]
    Company = Server[serverIndex][4]
    CompanyItem = Server[serverIndex][5]



    var userIndex = getPlayerIndex(interaction)
    var userID = interaction.user.id

    if (interaction.commandName === "help") {
        const user = client.users.cache.get(interaction.member.user.id);

        
        const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("Check DMs!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
        
        user.send("**Basic job commands:** \n**"+prefix+"chop**: Used by lumberjacks to chop down trees\n**"+prefix+"mine**: Used by miners to mine resources\n**"+prefix+"farm**: Used by farmers to harvest crops\n**"+prefix+"harvest**: Used by special jobs to harvest their unique resource.");
        user.send("``` ```**Company commands:** \n**"+prefix+"work**: Used by workers to produce a certain item, if the ingredients are available.\n**"+prefix+"setitems <item1>, <item2>, <item3>, <item4>, <item5>**: Used by entrepreneurs to set what five items the workers can produce. Separate items using commas.\n**"+prefix+"company sell <item>**: Used by entrepreneurs to sell ONE item from the item stockpile of the company to the market.\n**"+prefix+"company buy <item> <amount>**: Used by entrepreneurs to buy items from the market to be added to the item stockpile of the company\n**"+prefix+"setwage <value>**: Used by entrepreneurs to set how much money the workers make for every time they work or time interval\n**"+prefix+"hire <user-id>**: Used by entrepreneurs to accept the hire-request of a user\n**"+prefix+"fire <user-id> <reason>**: Used by entrepreneurs to fire a worker from the company for either abuse, inactivity, bankruptcy or behavior\n**"+prefix+"join <user-id>**: Used by users to ask to join a company of an entrepreneur, who has to accept the request.\n**"+prefix+"leavejob**: Used by workers to leave the company that they work in. Can only be used every 5 days.\n**"+prefix+"customize <options> <value>**: Used by entrepreneurs to customize certain aspects of their company: payment (interval, work), name (custom name)\n**"+prefix+"company info**: Used either by workers or entrepreneurs to view important information about their company\n**"+prefix+"company deposit/withdraw <value>**: Used by entrepreneurs to deposit/withdraw money to/from the company-account. \n**"+prefix+"company create <name>**: Used by users to create a company if they don't have a job. This requires $1000, which is then transferred from the user to the company.\n**"+prefix+"company disband**: Used by entrepreneurs to disband their company. This fires all workers, sells all items and transfers all capital to the entrepreneur.");
        user.send("``` ```**General commands:** \n**"+prefix+"gift <user-id> <value>**: Used by anyone to gift money to someone. 1h cooldown and $10000 max amount.\n**"+prefix+"loan <value>**: Used by anyone to take a loan. Maximum $10000. You get 10% interest each day. If you reach $100,000 in debt, you cannot loan money, create companies or buy secondary items. Your debt will then no longer increase.\n**"+prefix+"paydebt <value>**: Used by anyone to pay back debt using their money.\n**"+prefix+"drink**: Consumes 1 water from your inventory and fills up your thirst bar.\n**"+prefix+"eat**: Consumes 1 grocery from your inventory and fills up your hunger bar.\n**"+prefix+"consume <item>**: Consumes an item from your inventory, e.g. water, grocery or fish, and applies the corresponding effects\n**"+prefix+"marketinfo**: Used by anyone to receive info about the market, namely a list of all items, their stockpiled amounts and their prices.\n**"+prefix+"buy <item> <amount>**: Used by anyone to buy items directly from the market. If no amount is specified, one item will be bought. For companies, use " + prefix + "company buy <item> <amount>")
        user.send("``` ```**Admin commands:** \n**"+prefix+"setMoney <user-id> <value>**: Sets the money of a user. A negative value corresponds to debt.\n**"+prefix+"addMoney <user-id> <value>**: Adds money to a user. Can be negative.\n**"+prefix+"setsupply <item> <value>**: Sets the supply of an item in the marketplace. Must be positive or 0.\n**"+prefix+"setprice <item> <value>**: Sets the price of an item in the marketplace. Must be positive. \n**"+prefix+"company disband <user-id>**: Can be used by both entrepreneurs and admins to disband a company.\n**"+prefix+"setDebt <user-id> <value>**: Sets the debt of a user.\n**"+prefix+"addDebt <user-id> <value>**: Adds debt to a user. Use negative numbers to remove debt.\n**"+prefix+"bailout <min-debt> <user-amount>**: Used to set the debt of specified users to 0.\n**"+prefix+"additem <user-id> <item> <amount>**: Adds an item to a user. If no amount is specified, one item is added.\n**"+prefix+"removeitem <user-id> <item> <amount>**: Removes an item from a user. If no amount is specified, one item is removed.");
    
    }

    if (interaction.commandName === "ping") {
        interaction.reply("Pong!");
    }

    if (interaction.commandName === "stats") {
        var user = interaction.options.get("user")?.user

        var playerIndex = user === undefined ? userIndex : getPlayerIndexByID(user.id)

        username = "";
        idWithName.forEach(element => {
            if (element[0] === Player[playerIndex][0]) {
                username = element[1];
            }
        }); 

        // Basic stats

        let job = Player[playerIndex][5] || "jobless";
        let money = -1.0
        let debt = -1.0
        let hunger = 101
        let thirst = 101

        job = Player[playerIndex][5]
        money = Math.round(Player[playerIndex][1]*100)/100
        debt = Math.round(Player[playerIndex][2]*100)/100
        hunger = Player[playerIndex][3]
        thirst = Player[playerIndex][4]

        // Player Inventory

        var invItems = ""
        for (let i = 0; i < PlayerItem.length; i++) {
            if (PlayerItem[i][0] === Player[playerIndex][0]) {
                invItems += (PlayerItem[i][2] + "x " + PlayerItem[i][1] + ", ")
            }
        }
        invItems = invItems.slice(0,-2)

        console.log(invItems)

        if (job.length === 0) {
            job = "Jobless"
        }

        const embed = new EmbedBuilder()
        .setTitle('Stats of ' + username)
        .setColor('#FFFF00')
        .addFields({
                name: 'Job:', 
                value: job,
                inline: false
            },
            {
                name: 'Money:', 
                value: '$' + (Math.round(money*100)/100).toString(),
                inline: false
            },
            {
                name: 'Debt:', 
                value: '$' + (Math.round(debt*100)/100).toString(),
                inline: false
            },
            {
                name: 'Hunger:', 
                value: hunger.toString() + "/100",
                inline: false
            },
            {
                name: 'Thirst:', 
                value: thirst.toString() + "/100",
                inline: false
            },
            {
                name: 'Inventory:', 
                value: invItems,
                inline: false
            });
        

        // Send the embed in the same channel as the command message
  
        interaction.reply({embeds: [embed]})
        //interaction.reply("Stats of " + username + ":\nJob: " + job + "\nMoney: $" + money + "\nDebt: $" + debt + "\nHunger: " + hunger + "/100\nThirst: " + thirst + "/100\nInventory: " + invItems);

        
    }

    if (interaction.commandName === "job") {
        
        const newJob = interaction.options.get("job-type")?.value;
        if (Player[userIndex][5] === "Entrepreneur") {
            const embed = new EmbedBuilder()
            .setTitle('Error!')
            .setDescription('To delete your company, use /company disband!')
            .setColor('#FF0000')

            interaction.reply({embeds: [embed]})
            return;
        }
        if (Player[userIndex][5] === "Worker") {
            const embed = new EmbedBuilder()
            .setTitle('Error!')
            .setDescription('To leave your company, use /leavejob!')
            .setColor('#FF0000')

            interaction.reply({embeds: [embed]})
            return;
        }
        if (jobCooldown.includes(userID)) {
            const embed = new EmbedBuilder()
            .setTitle('Error!')
            .setDescription('Changing jobs has an one hour cooldown!')
            .setColor('#FF0000')

            interaction.reply({embeds: [embed]})
            return
        }
        

        if (newJob === "Special Job: Water" || newJob === "Special Job: Natural Gas" || newJob === "Special Job: Petroleum") { // Need $100 entry-fee
            if (Player[userIndex][1] < 100) {
                const embed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription('You need $100 to start this job!')
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return
            }
            Player[userIndex][1] -= 100
        }

        if (newJob === "Entrepreneur") {
            const embed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription('Use /company create <name> instead!')
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return
        }

        jobCooldown.push(userID)
        setTimeout(() => {
            jobCooldown.shift();
        }, 3600000) // time in ms

        Player[userIndex][5] = newJob
        const embed = new EmbedBuilder()
        .setTitle('Success!')
        .setDescription("You just took the job of " + newJob)
        .setColor('#00FF00')
        interaction.reply({embeds: [embed]})
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "items") {
        const embed = new EmbedBuilder()
        .setTitle('The ingame items are:')
        .setDescription("Wood\nRubber\nGrain\nLeather\nFish\nWool\nIron\nMinerals\nCoal\nPhosphorus\nWater\nNatural Gas\nPetroleum\n \nCar\nFurniture\nTruck\nPlane\nHousing\nGun\nTank\nFuel\nClothes\nFabric\nGrocery\nPaper\nEngine\nExplosive\nShip\nTool\nArtillery\nAmmunition\nGlass\nFine Art\nSilk\nHardwood\nLuxury clothes\nLuxury furniture\nComputer\nElectricity\nElectronics\nInternet Server\nInternet Cable\n \nWater Cleaning\nGas Pipeline\nOil Drilling Machine\nPickaxe\nMining Machine\nFertilizer\nTractor\nAxe\nChainsaw")
        .setColor('#FFFF00')
        interaction.reply({embeds: [embed]})
    }
    if (interaction.commandName === "ingredients") {
        var item = interaction.options.get("item")?.value

        var found_item = 0;
            produceable_items.forEach(i => {
                if (item.toLowerCase() === i.toLowerCase()) {
                    found_item = 1;
                    item = i
                }
            });
            if (found_item === 0) {
                const embed = new EmbedBuilder()
                .setTitle('Error!')
                .setDescription("You have entered an invalid item name!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
                return;
            }


        let strIngredients = ""
        let ingredients = getIngredients(item)// Ex: Iron:1,Minerals:1,Explosive:1
                    ingredients = ingredients.split(",")
                    for (let x = 0; x < ingredients.length; x++) {
                        ingredients[x] = ingredients[x].split(":")
                    }
                            
                    for (let y = 0; y < ingredients.length; y++) {
                        strIngredients += (ingredients[y][1] + "x " + ingredients[y][0] + ", ")
                    }
                    strIngredients = strIngredients.slice(0,-2)
                    const embed = new EmbedBuilder()
                    .setTitle(item + ":")
                    .setDescription(strIngredients)
                    .setColor('#FFFF00')
                    interaction.reply({embeds: [embed]})
                    return
                        

    }

    if (interaction.commandName === "chop") {
        var job = Player[userIndex][5]

        if (job != "Lumberjack") {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are not a lumberjack!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        if (!(hasItem(userIndex, "Axe", 1) || hasItem(userIndex, "Chainsaw", 1))) { // If the player neither has Axe nor Chainsaw
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You don't have an axe! How do you expect to chop down trees without it?")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        if (Player[userIndex][3] <= 0) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are too hungry to work!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        if (Player[userIndex][4] <= 0) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are too thirsty to work!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        if (workCooldown.includes(userID)) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("Working has an one minute cooldown!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return
        }
        workCooldown.push(userID)
        setTimeout(() => {
            workCooldown.shift();
            interaction.user.send("You can now work again!")
        }, 10000) // time in ms

        const oldHunger = Player[userIndex][3]
        const oldThirst = Player[userIndex][4]

        work(userIndex)
        var itemTag = ""
        var amount = 0
        const hasAxe = hasItem(userIndex, "Axe", 1);
        const hasChainsaw = hasItem(userIndex, "Chainsaw", 1);
        const resource = getRandomNumberBetween(0,1); // 0 = wood, 1 = rubber
        const wood = hasChainsaw === true ? getRandomNumberBetween(2,6) : hasAxe === true ? getRandomNumberBetween(1,3) : 0;
        const rubber = hasChainsaw === true ? getRandomNumberBetween(1,3) : hasAxe === true ? 1 : 0;


        if (resource === 0) {
            itemTag = "Wood"
            amount = wood
            
        }
        else {
            itemTag = "Rubber"
            amount = rubber
            str = rubber + "x Rubber"
        }
        str = amount + "x " + itemTag

        let item = hasChainsaw === true ? "Chainsaw" : "Axe"
        let durability = useItem(userIndex, item)

        addItem(userIndex, itemTag, amount)
        
        const embed = new EmbedBuilder()
            .setTitle("Success!")
            .setDescription("You just chopped a tree and gained " + str + "!")
            .setColor('#00FF00')
            .addFields({
                    name: item + " Durability",
                    value: (durability + 1).toString() + " -> " + durability.toString()
                },
                {
                    name: "Hunger",
                    value: oldHunger.toString() + " -> " + Player[userIndex][3].toString()
                },
                {
                    name: "Thirst",
                    value: oldThirst.toString() + " -> " + Player[userIndex][4].toString()
            });
        interaction.reply({embeds: [embed]})

        
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "mine") {
        var job = Player[userIndex][5]
        
        if (job != "Miner") {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are not a miner!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return
        }
        if (!(hasItem(userIndex, "Pickaxe", 1) || hasItem(userIndex, "Mining Machine", 1))) { // If the player has no tools
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You don't have a pickaxe! How do you expect to mine resources without it?")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        if (Player[userIndex][3] <= 0) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are too hungry to work!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        if (Player[userIndex][4] <= 0) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are too thirsty to work!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        if (workCooldown.includes(userID)) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("Workinghas an one minute cooldown!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return
        }
        workCooldown.push(userID)
        setTimeout(() => {
            workCooldown.shift();
            interaction.user.send("You can now work again!")
        }, 10000) // time in ms
        const oldHunger = Player[userIndex][3]
        const oldThirst = Player[userIndex][4]

        work(userIndex)
        var itemTag = ""
        var amount = 0
        const hasPickaxe = hasItem(userIndex, "Pickaxe", 1);
        const hasMiningMachine = hasItem(userIndex, "Mining Machine", 1);
        const resource = getRandomNumberBetween(0,3); // 0 = iron, 1 = minerals, 2 = coal, 3 = phosphorus
        const iron = hasMiningMachine === true ? getRandomNumberBetween(5,12) : hasPickaxe === true ? getRandomNumberBetween(1,2) : 0;
        const minerals = hasMiningMachine === true ? getRandomNumberBetween(3,6) : hasPickaxe === true ? 1 : 0;
        const coal = hasMiningMachine === true ? getRandomNumberBetween(5,12) : hasPickaxe === true ? getRandomNumberBetween(1,2) : 0;
        const phosphorus = hasMiningMachine === true ? getRandomNumberBetween(7,15) : hasPickaxe === true ? getRandomNumberBetween(1,4) : 0;
        if (resource === 0) {
            itemTag = "Iron"
            amount = iron
        }
        else if (resource === 1) {
            itemTag = "Minerals"
            amount = minerals
        }
        else if (resource === 2) {
            itemTag = "Coal"
            amount = coal
        }
        else {
            itemTag = "Phosphorus"
            amount = phosphorus
        }
        str = amount + "x " + itemTag

        let item = hasMiningMachine === true ? "Mining Machine" : "Pickaxe"
        let durability = useItem(userIndex, item)

        addItem(userIndex, itemTag, amount)

        const embed = new EmbedBuilder()
            .setTitle("Success!")
            .setDescription("You just mined resources and gained " + str + "!")
            .setColor('#00FF00')
            .addFields({
                    name: item + " Durability",
                    value: (durability + 1).toString() + " -> " + durability.toString()
                },
                {
                    name: "Hunger",
                    value: oldHunger.toString() + " -> " + Player[userIndex][3].toString()
                },
                {
                    name: "Thirst",
                    value: oldThirst.toString() + " -> " + Player[userIndex][4].toString()
            });
        interaction.reply({embeds: [embed]})

        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "farm") {
        var job = Player[userIndex][5]
        
        if (job != "Farmer") {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are not a farmer!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return
        }
        if (Player[userIndex][3] <= 0) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are too hungry to work!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        if (Player[userIndex][4] <= 0) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are too thirsty to work!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        if (workCooldown.includes(userID)) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("Working has an one minute cooldown!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return
        }
        workCooldown.push(userID)
        setTimeout(() => {
            workCooldown.shift();
            interaction.user.send("You can now work again!")
        }, 10000) // time in ms
        const oldHunger = Player[userIndex][3]
        const oldThirst = Player[userIndex][4]
        work(userIndex)

        var itemTag = ""
        var amount = 0
        const hasFertilizer = hasItem(userIndex, "Fertilizer", 1);
        const hasTractor = hasItem(userIndex, "Tractor", 1);
        var resource = getRandomNumberBetween(0,3); // 0 = grain, 1 = leather, 2 = fish, 3 = wool
        const grain = hasTractor === true ? getRandomNumberBetween(4,10) : hasFertilizer === true ? getRandomNumberBetween(1,5) : getRandomNumberBetween(1,2);
        const leather = getRandomNumberBetween(1,3);
        const fish = getRandomNumberBetween(1,3);
        const wool = getRandomNumberBetween(1,2);
        if (interaction.options.get("item")?.value != undefined) {
            
            let item = interaction.options.get("item")?.value.toLowerCase()
            resource = item === "grain" ? 0 : item === "leather" ? 1 : item === "fish" ? 2 : 3
        }
        var str = resource === 0 ? grain + "x Grain" : resource === 1 ? leather + "x Leather" : resource === 2 ? fish + "x Fish" : wool + "x Wool";


        if (resource === 0) {
            itemTag = "Grain"
            amount = grain
        }
        else if (resource === 1) {
            itemTag = "Leather"
            amount = leather
        }
        else if (resource === 2) {
            itemTag = "Fish"
            amount = fish
        }
        else if (resource === 3) {
            itemTag = "Wool"
            amount = wool
        }
        str = amount + "x " + itemTag

        addItem(userIndex, itemTag, amount)

        let item = hasTractor === true ? "Tractor" : hasFertilizer === true ? "Fertilizer" : null
        if (item != null) {
            let durability = useItem(userIndex, item)
            const embed = new EmbedBuilder()
            .setTitle("Success!")
            .setDescription("You just harvested crops and gained " + str + "!")
            .setColor('#00FF00')
            .addFields({
                    name: item + " Durability",
                    value: (durability + 1).toString() + " -> " + durability.toString()
                },
                {
                    name: "Hunger",
                    value: oldHunger.toString() + " -> " + Player[userIndex][3].toString()
                },
                {
                    name: "Thirst",
                    value: oldThirst.toString() + " -> " + Player[userIndex][4].toString()
            });
            interaction.reply({embeds: [embed]})
            return;
        }
        const embed = new EmbedBuilder()
            .setTitle("Success!")
            .setDescription("You just harvested crops and gained " + str + "!")
            .setColor('#00FF00')
            .addFields({
                    name: "Hunger",
                    value: oldHunger.toString() + " -> " + Player[userIndex][3].toString()
                },
                {
                    name: "Thirst",
                    value: oldThirst.toString() + " -> " + Player[userIndex][4].toString()
            });
            interaction.reply({embeds: [embed]})

        

        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "harvest") {
        var job = Player[userIndex][5]
        
        if (!(job === "Special Job: Water" || job === "Special Job: Natural Gas" || job === "Special Job: Petroleum")) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are not a special job!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return
        }
        if (Player[userIndex][3] <= 0) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are too hungry to work!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        if (Player[userIndex][4] <= 0) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are too thirsty to work!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        if (workCooldown.includes(userID)) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("Working has an one minute cooldown!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return
        }
        workCooldown.push(userID)
        setTimeout(() => {
            workCooldown.shift();
            interaction.user.send("You can now work again!")
        }, 10000) // time in ms
        const oldHunger = Player[userIndex][3]
        const oldThirst = Player[userIndex][4]
        work(userIndex)
        var specialJob = 0; // 0 = Water, 1 = Natural Gas, 2 = Petroleum
        var hasAddon = false;
        if (job === "Special Job: Water") { specialJob = 0; hasAddon = hasItem(userIndex, "Water Cleaning", 1) }
        if (job === "Special Job: Natural Gas") { specialJob = 1; hasAddon = hasItem(userIndex, "Gas Pipeline", 1) }
        if (job === "Special Job: Petroleum") { specialJob = 2; hasAddon = hasItem(userIndex, "Oil Drilling Machine", 1) }

        var itemTag = ""
        var amount = 0
        resource = hasAddon === true ? getRandomNumberBetween(1,3) : 1;

        let item = null
        if (specialJob === 0) {
            itemTag = "Water"
            item = hasAddon === true ? "Water Cleaning" : null
        }
        else if (specialJob === 1) {
            itemTag = "Natural Gas"
            item = hasAddon === true ? "Gas Pipeline" : null
        }
        else {
            itemTag = "Petroleum"
            item = hasAddon === true ? "Oil Drilling Machine" : null
        }
        amount = resource
        str = amount + "x " + itemTag

        addItem(userIndex, itemTag, amount)

        if (item != null) {
            let durability = useItem(userIndex, item)
            const embed = new EmbedBuilder()
            .setTitle("Success!")
            .setDescription("You just harvested your special resources and gained " + str + "!")
            .setColor('#00FF00')
            .addFields({
                    name: item + " Durability",
                    value: (durability + 1).toString() + " -> " + durability.toString()
                },
                {
                    name: "Hunger",
                    value: oldHunger.toString() + " -> " + Player[userIndex][3].toString()
                },
                {
                    name: "Thirst",
                    value: oldThirst.toString() + " -> " + Player[userIndex][4].toString()
            });
            interaction.reply({embeds: [embed]})
            return;
        }
        const embed = new EmbedBuilder()
            .setTitle("Success!")
            .setDescription("You just harvested your special resources and gained " + str + "!")
            .setColor('#00FF00')
            .addFields({
                    name: "Hunger",
                    value: oldHunger.toString() + " -> " + Player[userIndex][3].toString()
                },
                {
                    name: "Thirst",
                    value: oldThirst.toString() + " -> " + Player[userIndex][4].toString()
            });
            interaction.reply({embeds: [embed]})
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "work") {
        var job = Player[userIndex][5]

        if (job != "Worker") {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are not a worker!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        if (!(hasItem(userIndex, "Tool", 1))) { // If the player has no tools
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You don't have a tool! How do you expect to work in a factory without it?")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        if (Player[userIndex][3] <= 0) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are too hungry to work!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        if (Player[userIndex][4] <= 0) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are too thirsty to work!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        if (workCooldown.includes(userID)) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("Working has an one minute cooldown!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return
        }
        
        var amount = 0
        var item = interaction.options.get("item").value;
        var found_item = 0;
        produceable_items.forEach(i => {
            if (item.toLowerCase() === i.toLowerCase()) {
                item = i
                found_item = 1;
            }
        });
        if (found_item === 0) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You have entered an invalid item name!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }

        /////////

        var companyIndex
        for (let c = 0; c < Company.length; c++) { // Looping through all companies
            if (Company[c][1].length > 0) {
                for (let w = 0; w < Company[c][1].length; w++) { // Looping through all the workers
                    if (Company[c][1][w] === interaction.user.id) {
                        companyIndex = c
                    }
                }
            }
        }
        if (Company[companyIndex] === undefined) {
            console.log(companyIndex)
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("[003] Company undefined error! Please rejoin your company using /leavejob and /join <user>")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return
        }
        
        let allowedItems = Company[companyIndex][2] // Checking if the item is allowed to be produced
        
        for (let i = 0; i < allowedItems.length; i++) {
            console.log(allowedItems)
            if (item.toLowerCase() === allowedItems[i].toLowerCase()) {
                
                
                // Check if worksteps are 0: Make new item
                
                if (Company[companyIndex][8][i] === 0) {
                    
                    
                    //console.log("(1) Worksteps: " + Company[companyIndex][8][i])
                    // Check for resources
                    let ingredients = getIngredients(item)// Ex: Iron:1,Minerals:1,Explosive:1
                    ingredients = ingredients.split(",")
                    for (let x = 0; x < ingredients.length; x++) {
                        ingredients[x] = ingredients[x].split(":")
                    }
                    for (let x = 0; x < ingredients.length; x++) {
                        //console.log(ingredients)
                        if (!companyHasItem(companyIndex, ingredients[x][0], ingredients[x][1])) { // If the company does not have a sufficient amount of a certain resource
                            let strIngredients = ""
                            for (let y = 0; y < ingredients.length; y++) {
                                strIngredients += (ingredients[y][1] + "x " + ingredients[y][0] + ", ")
                            }
                            strIngredients = strIngredients.slice(0,-2)
                            const embed = new EmbedBuilder()
                            .setTitle("Error!")
                            .setDescription("You don't have enough resources to build this. You need: " + strIngredients)
                            .setColor('#FF0000')
                            interaction.reply({embeds: [embed]})
                            
                            return;
                        }

                        // Set worksteps
                    Company[companyIndex][8][i] = Item[getItemIndex(item)][5]
                        
                    }  
                    console.log(ingredients)
                    for (let x = 0; x < ingredients.length; x++) {
                        // Remove resources
                        console.log("this is it: " + ingredients[x][0])
                        companyRemoveItem(companyIndex, ingredients[x][0], ingredients[x][1])
                        synchronizeServerData(interaction.guild.id)
                    }
                }
                console.log("We just removed one workstep!")
                // Remove worksteps from the item
                Company[companyIndex][8][i] -= 1;
                const oldHunger = Player[userIndex][3]
                const oldThirst = Player[userIndex][4]
                work(userIndex) // User works and loses energy (hunger and thirst)
                let durability = useItem(userIndex, "Tool")
                //console.log("(2) Worksteps: " + Company[companyIndex][8][i])

                // Paying the worker for his work
                if (Company[companyIndex][6] === "work") {
                    if (Company[companyIndex][3] >= Company[companyIndex][4]) { // If the company has enough money to pay the worker
                        Company[companyIndex][3] -= Company[companyIndex][4]
                        Player[userIndex][1] += Company[companyIndex][4]
                    }
                }

                // Check if worksteps are 0
                if (Company[companyIndex][8][i] <= 0) {
                    console.log("Product will be completed!")
                    Company[companyIndex][8][i] = 0
                    
                    // Produce item
                    companyAddItem(companyIndex, item, 1)
                    workCooldown.push(userID)
                    setTimeout(() => {
                        workCooldown.shift();
                        interaction.user.send("You can now work again!")
                    }, 10000) // time in ms
                    const embed = new EmbedBuilder()
                    .setTitle("Success!")
                    .setDescription("You worked in the factory and produced 1x " + item + "!")
                    .setColor('#00FF00')
                    .addFields({
                            name: item + " Durability",
                            value: (durability + 1).toString() + " -> " + durability.toString()
                        },
                        {
                            name: "Hunger",
                            value: oldHunger.toString() + " -> " + Player[userIndex][3].toString()
                        },
                        {
                            name: "Thirst",
                            value: oldThirst.toString() + " -> " + Player[userIndex][4].toString()
                    });
                    interaction.reply({embeds: [embed]})
                    synchronizeServerData(interaction.guild.id)
                }

                else {
                    workCooldown.push(userID)
                    setTimeout(() => {
                        workCooldown.shift();
                        interaction.user.send("You can now work again!")
                    }, 10000) // time in ms
                    const embed = new EmbedBuilder()
                    .setTitle("Success!")
                    .setDescription("You worked in the factory and worked on 1x " + item + "! (" + Company[companyIndex][8][i] + " steps left)")
                    .setColor('#00FF00')
                    .addFields({
                            name: "Tool Durability",
                            value: (durability + 1).toString() + " -> " + durability.toString()
                        },
                        {
                            name: "Hunger",
                            value: oldHunger.toString() + " -> " + Player[userIndex][3].toString()
                        },
                        {
                            name: "Thirst",
                            value: oldThirst.toString() + " -> " + Player[userIndex][4].toString()
                    });
                    interaction.reply({embeds: [embed]})
                    synchronizeServerData(interaction.guild.id)
                }

                
                return;
            }
        }
        const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("Your company does not allow you to produce this item! The entrepreneur must first use /setitems " + item)
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})

        /////////

    }

    if (interaction.commandName === "setitems") {
        const companyIndex = getCompanyIndex(userIndex)
        var item1 = interaction.options.get('item1').value;
        var item2 = interaction.options.get('item2')?.value;
        var item3 = interaction.options.get('item3')?.value;
        var item4 = interaction.options.get('item4')?.value;
        var item5 = interaction.options.get('item5')?.value;

        if (companyIndex === false) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You don't have a company!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return
        }

        

        found_items = [0,item2 === undefined ? 1 : 0,item3 === undefined ? 1 : 0,item4 === undefined ? 1 : 0,item5 === undefined ? 1 : 0]
        produceable_items.forEach(item => {
            if (item1.toLowerCase() === item.toLowerCase()) {
                item1 = item
                found_items[0] = 1;
                
            }
            else if (item2 != undefined && item2.toLowerCase() === item.toLowerCase()) {
                item2 = item
                found_items[1] = 1;
            }
            else if (item3 != undefined && item3.toLowerCase() === item.toLowerCase()) {
                item3 = item
                found_items[2] = 1;
            }
            else if (item4 != undefined && item4.toLowerCase() === item.toLowerCase()) {
                item4 = item
                found_items[3] = 1;
            }
            else if (item5 != undefined && item5.toLowerCase() === item.toLowerCase()) {
                item5 = item
                found_items[4] = 1;
            }
        });

        if (item2 === null || item2 === undefined) {
            item2 = ""
        }
        if (item3 === null || item3 === undefined) {
            item3 = ""
        }
        if (item4 === null || item4 === undefined) {
            item4 = ""
        }
        if (item5 === null || item5 === undefined) {
            item5 = ""
        }


       

        
        
        // EntrepreneurID, Workers, ProducibleItems, Capital, Wage, Name, PaymentOption, JoinRequests, Worksteps
        Company[companyIndex][2] = [item1, item2, item3, item4, item5]

        var str = ""

        for (let i = 0; i < Company[companyIndex][2].length; i++) {
            if (Company[companyIndex][2][i] != "") {
                str += Company[companyIndex][2][i] + ", "
            }
        }


        str = str.slice(0,-2)

        console.log(str)

        console.log(Company[companyIndex][2])

        if (found_items[0] === 0 || found_items[1] === 0 || found_items[2] === 0 || found_items[3] === 0 || found_items[4] === 0) {
            const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You have entered invalid item names!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        console.log(str)
        const embed = new EmbedBuilder()
            .setTitle("Success!")
            .setDescription("Your company is now producing: " + str + "!")
            .setColor('#00FF00')
            interaction.reply({embeds: [embed]})
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "company") {
        var companyIndex = getCompanyIndex(userIndex)
        if (interaction.options.getSubcommand() === "sell") {

            console.log(workCooldown)

            if (companyIndex === false) {
                const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are not an entrepreneur!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
                return;
            }
            var item = interaction.options.get("item").value;

            if (Player[userIndex][3] <= 0) {
                const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are too hungry to work!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
                return;
            }
            if (Player[userIndex][4] <= 0) {
                const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are too thirsty to work!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
                return;
            }
            if (workCooldown.includes(userID)) {
                const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("Working has an one minute cooldown!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return
        }
        
        const oldHunger = Player[userIndex][3]
        const oldThirst = Player[userIndex][4]
            work(userIndex)

            var found_item = 0;
            items.forEach(i => {
                if (item.toLowerCase() === i.toLowerCase()) {
                    found_item = 1;
                    item = i
                }
            });
            if (found_item === 0) {
                const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You have entered an invalid item name!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
                return;
            }

            ciIndex = getCompanyItemIndex(companyIndex, item)
            if (CompanyItem[ciIndex][2] < 1) { // Company has less items in the stockpile as they wants to sell
                const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You don't have that item in stock!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
                return;
            }
            priceYielded = getSellPrice(item, 1)
            const embed = new EmbedBuilder()
            .setTitle("Success!")
            .setDescription("You just sold 1x " + item + " for $" + Math.round(priceYielded * 100)/100 + "!")
            .setColor('#00FF00')
            .addFields({
                    name: "Hunger",
                    value: oldHunger.toString() + " -> " + Player[userIndex][3].toString()
                },
                {
                    name: "Thirst",
                    value: oldThirst.toString() + " -> " + Player[userIndex][4].toString()
            });
            interaction.reply({embeds: [embed]})
            workCooldown.push(userID)
            setTimeout(() => {
            workCooldown.shift();
            interaction.user.send("You can now work again!")
        }, 10000) // time in ms
            companySellItem(companyIndex, item, 1)
        }

        if (interaction.options.getSubcommand() === "buy") {
            if (companyIndex === false) {
                const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You are not an entrepreneur!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
                return;
            }
            var item = interaction.options.get("item").value;
            var amount = interaction.options.get("amount")?.value;
            amount = amount === undefined ? 1 : amount;

            var found_item = 0;
            items.forEach(i => {
                if (item.toLowerCase() === i.toLowerCase()) {
                    found_item = 1;
                    item = i
                }
            });
            if (found_item === 0) {
                const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("You have entered an invalid item name!")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
                return;
            }

            let payedPrice = getBuyPrice(item, amount)
            if (Company[companyIndex][3] < payedPrice) { // If the Company-capital is less than the cost of the item
                const embed = new EmbedBuilder()
            .setTitle("Error!")
            .setDescription("This transaction would cost $" + Math.round(payedPrice*100)/100 + ". You don't have enough capital for that! (Current capital: $" + Math.round(Company[companyIndex][1]*100)/100 + ")")
            .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
                return;
            }
            let itemStockpile = getItemStockpile(item)
            if (amount > itemStockpile) { // If the item-stockpile isn't large enough for the purchase-request
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("The " + item + " stockpile is only at " + itemStockpile + " at the moment!")
                .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
                return;
            }
            const embed = new EmbedBuilder()
            .setTitle("Success!")
            .setDescription("You just bought " + amount + "x " + item + " for $" + Math.round(payedPrice * 100)/100)
            .setColor('#00FF00')
            interaction.reply({embeds: [embed]})
            companyBuyItem(companyIndex, item, amount)

            
        }

        if (interaction.options.getSubcommand() === "info") {
            if (companyIndex === false && Player[userIndex][5] != "Worker") {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are neither an entrepreneur nor a worker!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
                return;
            }
            if (Player[userIndex][5] === "Worker") { // Getting the companyIndex via a different way
                for (let c = 0; c < Company.length; c++) {
                    if (Company[c][1].length > 0) {
                        for (let w = 0; w < Company[c][1].length; w++) {
                            if (Company[c][1][w] === Player[userIndex][0]) { // If the player works at that company
                                companyIndex = c
                                userIndex = getPlayerIndexByID(Company[c][0])
                            }
                        }
                    }
                }
            }
            // EntrepreneurID, Workers, ProducibleItems, Capital, Wage, Name, PaymentOption, JoinRequests, Worksteps
            const companyName = Company[companyIndex][5];
            const capital = Company[companyIndex][3];
            const itemList = Company[companyIndex][2]; //["Car", "Plane", "Wood"]
            var paymentType = Company[companyIndex][6];
            const wage = Company[companyIndex][4];
            const entrepreneur = Company[companyIndex][0];
            const workers = Company[companyIndex][1];
            const joinRequests = Company[companyIndex][7];
            const worksteps = Company[companyIndex][8];

            console.log(workers)
            // Call the function to remove duplicates
            idWithName = removeDuplicates(idWithName);

            var itemStockpile = ""
            for (let i = 0; i < CompanyItem.length; i++) {
                if (CompanyItem[i][0] === Company[companyIndex][0]) {
                    itemStockpile += (CompanyItem[i][2] + "x " + CompanyItem[i][1] + ", ")
                }
            }
            itemStockpile = itemStockpile.slice(0,-2)


            // Turning the itemList into a string
            let strItemList = "";
            for (let i = 0; i < 5; i++) {
                if (itemList[i] != undefined && itemList[i] != "") {
                    strItemList += (itemList[i] + " (Steps left: " + worksteps[i] + "), ");
                }
                
            }
            if (strItemList != "") {
                strItemList = strItemList.substring(0, strItemList.length - 2);
            }

            
            // Turning the user-ids into usernames
            var entrepreneurName = "";
            var strWorkers = "";
            var strRequests = "";
            for (let i = 0; i < idWithName.length; i++) {
                if (entrepreneur === idWithName[i][0]) {
                    entrepreneurName = idWithName[i][1];
                }
                if (workers.length > 0) { // WorkerIDs into names
                    for (let j = 0; j < workers.length; j++) {
                        if (workers[j] === idWithName[i][0]) {
                            if (j+1 === workers.length) { // Last worker from the list
                                strWorkers += (idWithName[i][1]);
                            }
                            else { // Any other worker from the list
                                strWorkers += (idWithName[i][1] + ", ");
                            }
                            
                        }
                    }
                }
                if (joinRequests.length > 0) { // JoinRequestIDs into names
                    for (let j = 0; j < joinRequests.length; j++) {
                        if (joinRequests[j] === idWithName[i][0]) {
                            if (j+1 === joinRequests.length) { // Last request from the list
                                strRequests += (idWithName[i][1]);
                            }
                            else { // Any other request from the list
                                strRequests += (idWithName[i][1] + ", ");
                            }
                            
                        }
                    }
                }
            }
            if (strRequests.length === 0) {
                strRequests = "No requests"
            }
            if (strWorkers.length === 0) {
                strWorkers = "No workers"
            }
            if (strItemList.length === 0) {
                strItemList = "No produceable items"
            }
            if (itemStockpile.length === 0) {
                itemStockpile = "No stockpiled items"
            }
            if (paymentType === "work") {
                paymentType = "Workers gain money each time they do /work"
            }
            else {
                paymentType = "Workers gain money each hour"
            }
            const embed = new EmbedBuilder()
                .setTitle(companyName.toString())
                .setColor('#FFFF00')
                .addFields({
                        name: "Capital:",
                        value: "$" + (Math.round(capital*100)/100).toString()
                    },
                    {
                        name: "Producible Items:",
                        value: strItemList
                    },
                    {
                        name: "Stockpiled Items:",
                        value: itemStockpile
                    },
                    {
                        name: "Payment Type:",
                        value: paymentType
                    },
                    {
                        name: "Wage:",
                        value: "$" + (Math.round(wage*100)/100).toString()
                    },
                    {
                        name: "Entrepreneur:",
                        value: entrepreneurName
                    },
                    {
                        name: "Workers:",
                        value: strWorkers
                    },
                    {
                        name: "Join-Requests:",
                        value: strRequests
                    }
                );
                interaction.reply({embeds: [embed]})
        }

        if (interaction.options.getSubcommand() === "deposit") {
            if (companyIndex === false) {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an entrepreneur")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
                return;
            }
            var money = Player[userIndex][1]; // Money of the user
            var capital = Company[companyIndex][3]; // Money of the company
            var toDeposit = interaction.options.get("value").value;

            if (toDeposit > money) {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You do not have sufficient money! (Current money: $" + money + ")")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})

                return;
            }
            money -= toDeposit;
            capital += toDeposit;
            Player[userIndex][1] = money
            Company[companyIndex][3] = capital
            const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just deposited $" + toDeposit + " to your company!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
        }

        if (interaction.options.getSubcommand() === "withdraw") {
            if (companyIndex === false) {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an entrepreneur!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
                return;
            }
            var money = Player[userIndex][1] ; // Money of the user
            var capital = Company[companyIndex][3]; // Money of the company
            var toWithdraw = interaction.options.get("value").value;

            if (toWithdraw > capital) {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("Your company does not have sufficient capital! (Current capital: $" + capital + ")")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
                return;
            }
            capital -= toWithdraw;
            money += toWithdraw;
            Player[userIndex][1] = money
            Company[companyIndex][3] = capital
            const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just withdrew $" + toWithdraw + " from your company!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
        }

        if (interaction.options.getSubcommand() === "create") {

            if (Player[userIndex][5] === "Entrepreneur") {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You already have a company!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
                return
            }
            
            money = Player[userIndex][1]; // Money of the user
            if (money < 1000) {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You have less than $1000! (Current money: $" + Math.round(money*100)/100 + ")")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
                return;
            }
            if (ccCooldown.includes(userID)) {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("Creating companies has a 24 hour cooldown!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
                return
            }
            ccCooldown.push(userID)
            setTimeout(() => {
                ccCooldown.shift();
                interaction.user.send("You can now create companies again!")
            }, 86400000) // time in ms
            var name = item = interaction.options.get("name").value;
            interaction.reply("You just founded the company " + name + "!");
            Player[userIndex][1] -= 1000
            // EntrepreneurID, Workers, ProducibleItems, Capital, Wage, Name, PaymentOption, JoinRequests, Worksteps
            Company.push([Player[userIndex][0], [], ["","","","",""], 1000, 1, interaction.options.get("name").value, "work", [], [0,0,0,0,0]])
            Player[userIndex][5] = "Entrepreneur"
            console.log("Created company " + interaction.options.get("name").value + "!")
            companyIndex = getCompanyIndex(userIndex)
            console.log(Company)
        }

        if (interaction.options.getSubcommand() === "disband") {
            var user = interaction.options.get("user")?.user
            if (user === undefined || user === null) {
            
            if (Company[companyIndex][1].length > 0) {
                for (let w = 0; w < Company[companyIndex][1].length; w++) { // Firing all workers
                    let firedUser = getPlayerIndexByID(Company[companyIndex][1][w])
                    Player[firedUser][5] = ""
                    console.log("Fired user!")
                }
            }
            Player[userIndex][5] = "" // The entrepreneur also loses his job
            for (let i = 0; i < CompanyItem.length; i++) {
                if (CompanyItem[i][0] === Company[companyIndex][0]) { // If the EntrepreneurIDs match
                    console.log("Sold " + CompanyItem[i][2] + "x " + CompanyItem[i][1])
                    companySellItem(companyIndex, CompanyItem[i][1], CompanyItem[i][2]) // Sells all items of the company
                    
                }
            }
            console.log("Added $" + Company[companyIndex][3] + " to the user")
            Player[userIndex][1] += Company[companyIndex][3] // Withdraws all money
            Company.splice(companyIndex, 1) // Deletes the company
            const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just disbanded your company!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
            synchronizeServerData(interaction.guild.id)
            return;
            }

            //////////
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an admin! Only admins can disband companies of other people")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
                return;
                
            }
            
            playerIndex = getPlayerIndexByID(user.id)
            companyIndex = getCompanyIndex(playerIndex)
            if (Company[companyIndex][1].length > 0) {
                for (let w = 0; w < Company[companyIndex][1].length; w++) { // Firing all workers
                    let firedUser = getPlayerIndexByID(Company[companyIndex][1][w])
                    Player[firedUser][5] = ""
                    console.log("Fired user!")
                }
            }
            Player[playerIndex][5] = "" // The entrepreneur also loses his job
            for (let i = 0; i < CompanyItem.length; i++) {
                if (CompanyItem[i][0] === Company[companyIndex][0]) { // If the EntrepreneurIDs match
                    console.log("Sold " + CompanyItem[i][2] + "x " + CompanyItem[i][1])
                    companySellItem(companyIndex, CompanyItem[i][1], CompanyItem[i][2]) // Sells all items of the company
                    
                }
            }
            console.log("Added $" + Company[companyIndex][3] + " to the user")
            Player[playerIndex][1] += Company[companyIndex][3] // Withdraws all money
            Company.splice(companyIndex, 1) // Deletes the company
            const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just disbanded the company of " + interaction.options.get("user")?.user.username + "!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})


        }
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "setwage") {
        const companyIndex = getCompanyIndex(userIndex)
        if (companyIndex === false) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an entrepreneur!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        const paymentOption = Company[companyIndex][6];
        var wage = interaction.options.get("value").value;
        if (wage <= 0) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("Your workers have to gain a positive amount!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return
        }
        Company[companyIndex][4] = wage
        if (paymentOption === "work") {
            const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("Your workers are now gaining $" + wage + " every time they do /work")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
            synchronizeServerData(interaction.guild.id)
            return;
        }
        const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("Your workers are now gaining $" + wage + " every hour")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "hire") {
        const companyIndex = getCompanyIndex(userIndex)
        const hiredUser = interaction.options.get("user").user
        if (companyIndex === false) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an entrepreneur!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }

        if (Company[companyIndex][7].length === 0) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("There are no people who want to join your company! They have to use /join " + interaction.user.username + " first!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }

        for (let i = 0; i < Company[companyIndex][7].length; i++) { // loops through all people who want to get hired
            if (Company[companyIndex][7][i] === hiredUser.id) {
                const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just hired " + hiredUser.username + " to your company!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
                Company[companyIndex][1].push(hiredUser.id)
                Company[companyIndex][7].splice(i,1)
                Player[getPlayerIndexByID(hiredUser.id)][5] = "Worker"

                // Removes all applications of that player from all other companies:
                for (let c = 0; c < Company.length; c++) { // Loops through all companies
                    if (Company[c][7].length > 0) {
                        for (let r = 0; r < Company[c][7].length; r++) { // Loops through all requests
                            if (Company[c][7][r] === Player[userIndex][0]) {
                                Company[c][7].splice(r,1) // Removes the request
                            }
                        }
                    }
                }
                
                return;
            }
        }
        const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("That person did not use /join " + interaction.user.username + " to request to join your company!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "fire") {
        const companyIndex = getCompanyIndex(userIndex)
        const firedUser = interaction.options.get("user").user
        

        if (companyIndex === false) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an entrepreneur!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        var reason = interaction.options.get("reason").value;
        
        if (Company[companyIndex][1].length === 0) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("Your company has no workers!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return
        }
        for (let i = 0; i < Company[companyIndex][1].length; i++) { // Looping through all your workers!
            if (Company[companyIndex][1][i] === firedUser.id) {
                Company[companyIndex][1].splice(i,1)
                Player[getPlayerIndexByID(firedUser.id)][5] = ""
                const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just fired " + firedUser.username + " from your company because of " + reason + "!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
            }
            
        }
        
        synchronizeServerData(interaction.guild.id)

    }
    

    if (interaction.commandName === "join") {
        const companyIndex = getCompanyIndex(userIndex)
        let user = interaction.options.get("user").user
        const companyJoinIndex = getCompanyIndex(getPlayerIndexByID(user.id))
        if (companyIndex != false) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You already have a company!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        if (companyJoinIndex === false) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("The user you mentioned has no company!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        if (Player[userIndex][5] == "Worker") {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are already part of a company!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        Company[companyJoinIndex][7].push(interaction.user.id)
        const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just requested to join the company of " + interaction.options.get("user").user.username + "!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "leavejob") {
        const companyIndex = getCompanyIndex(userIndex)
        if (companyIndex != false) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You cannot leave your own company! Use /company disband instead!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        if (Player[userIndex][5].toLowerCase() != "worker") {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("Only workers can use this! Use /job <job-type> instead!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        for (let c = 0; c < Company.length; c++) { // Looping through all the companies
            if (Company[c][1].length != 0) { 
                for (let w = 0; w < Company[c][1].length; w++) { // Looping through all the workers

                    if (Company[c][1][w] === interaction.user.id) { // Removing worker
                        Company[c][1].splice(w,1)
                        Player[getPlayerIndexByID(interaction.user.id)][5] = ""
                        const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just left your company!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
                    }
                }
            }
        }      
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "customize") {
        const companyIndex = getCompanyIndex(userIndex)
        if (companyIndex === false) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an entrepreneur!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        if (interaction.options.getSubcommandGroup() === "paymenttype") {
            var paymentType = interaction.options.getSubcommand();
            Company[companyIndex][6] = paymentType
            if (paymentType === "work") {
                const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("Your workers will now get their wage every time they do /work!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
                synchronizeServerData(interaction.guild.id)
                return;
            }
            const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("Your workers will now get their wage every hour!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
            synchronizeServerData(interaction.guild.id)
        }

        if (interaction.options.getSubcommand() === "name") {
            var name = interaction.options.get("name").value;
            Company[companyIndex][5] = name
            const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("Your company has been renamed to " + name + "!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
        }
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "gift") {
        if (giftCooldown.includes(userID)) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("Gifting money has an one hour cooldown!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return
        }
        giftCooldown.push(userID)
        setTimeout(() => {
            giftCooldown.shift();
            interaction.user.send("You can now gift money again!")
        }, 3600000) // time in ms
        var user = interaction.options.get("user").user;
        var amount = interaction.options.get("value").value;
        if (amount <= 10000) {
            if (Player[userIndex][2] > 0) {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You cannot have any debt in order to use gift money!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
                return
            }
            if (amount <= 0) {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You have to gift a positive amount!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
                return
            }
            if (Player[userIndex][1] >= amount) { // If the player has enough money to gift
                Player[userIndex][1] -= amount
                Player[getPlayerIndexByID(user.id)][1] += amount
                const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just gifted $" + amount + " to " + user.username + "!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
                synchronizeServerData(interaction.guild.id)
                return;
            }
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You don't have enough money for that! (Current money: $" + Player[userIndex][1] + ")")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You can gift at most $10000!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
    }

    if (interaction.commandName === "loan") {
        var amount = interaction.options.get("value")?.value;
        const debt = Player[userIndex][2];
        if (debt >= 100000) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("At $100k in debt, you can no longer take a loan!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        if (amount <= 0) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You have to loan a positive amount!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return
        }
        if (amount <= 10000) {
            Player[userIndex][1] += amount
            Player[userIndex][2] += (amount * 1.1)
            const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just loaned $" + amount + "!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
            synchronizeServerData(interaction.guild.id)
            return;
        }
        const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You can loan at most $10000!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
    }

    if (interaction.commandName === "paydebt") {

        var amount = interaction.options.get("value")?.value;
        var money = Player[userIndex][1];
        var debt = Player[userIndex][2];

        if (debt <= 0) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You have no debt to pay!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        if (amount > money) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You have too little money to pay back that amount! (Current money: $" + money + ")")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        debt -= amount;
        money -= amount;
        if (debt < 0) {
            money -= debt;
            debt = 0;
        }
        const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just payed back $" + amount + "! Your debt is now $" + debt + "!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})

        Player[userIndex][1] = money
        Player[userIndex][2] = debt
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "drink") {
        var thirst = Player[userIndex][4];
        if (!hasItem(userIndex, "Water", 1)) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You don't have water!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        if (thirst < 100) {
            const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just consumed one water! Your thirst bar is now full again!")
                .setColor('#00FF00')
            interaction.reply({embeds: [embed]})
            Player[userIndex][4] = 100
            removeItem(userIndex, "Water", 1)
        }
        else {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("Your thirst bar is completely full! There is no need to drink!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
        }

        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "eat") {
        var hunger = Player[userIndex][3];
        if (!hasItem(userIndex, "Grocery", 1)) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You don't have groceries!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        if (hunger < 100) {
            const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just consumed one grocery! Your hunger bar is now full again!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
            Player[userIndex][3] = 100
            removeItem(userIndex, "Grocery", 1)
        }
        else {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("Your hunger bar is completely full! There is no need to eat!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
        }

        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "consume") {
        var item = interaction.options.get("item")?.value;
        var hunger = Player[userIndex][3];
        var thirst = Player[userIndex][4];
        if (item === "Water") {
            if (!hasItem(userIndex, "Water", 1)) {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You don't have water!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
                return;
            }
            if (thirst < 100) {
                const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just consumed one water! Your thirst bar is now full again!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
                Player[userIndex][4] = 100
                removeItem(userIndex, "Water", 1)
            }
            else {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("Your thirst bar is completely full! There is no need to drink!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})

            }
        }

        if (item === "Grocery") {
            if (!hasItem(userIndex, "Grocery", 1)) {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You don't have groceries!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
                return;
            }
            if (hunger < 100) {
                const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just consumed one grocery! Your hunger bar is now full again!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
                Player[userIndex][3] = 100
                removeItem(userIndex, "Grocery", 1)
            }
            else {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("Your hunger bar is completely full! There is no need to eat!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            }
        }

        if (item === "Fish") {

            if (!hasItem(userIndex, "Fish", 1)) {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You don't have fish!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
                return;
            }

            if (hunger < 100 || thirst < 100) {
                Player[userIndex][3] = Math.min(hunger + 15, 100);
                Player[userIndex][4] = Math.min(thirst + 5, 100);
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You just consumed one fish! Thirst bar: " + Player[userIndex][4] + "% Hunger bar: " + Player[userIndex][3] + "%")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
                removeItem(userIndex, "Fish", 1)
            }
            else {
                const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("Your thirst and hunger bar are completely full! There is no need to consume fish!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            }

        }
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "marketinfo") {
        var market = [];
        var strMarket = "**Market:** ";
        var item = interaction.options.get("item")?.value
        if (item === undefined) {
        for (let i = 0; i < Item.length; i++) {
            market.push([Item[i][0] /*Name*/, Math.round(Item[i][1]*100)/100 /*Price*/, Item[i][2] /*Stockpile*/])
            strMarket += ("\n" + market[i][0] + ": $" + market[i][1] + "   -   📦" + market[i][2])
            console.log(market)
            if (i === 30 || i === Item.length - 1) {
                interaction.user.send(strMarket)
                strMarket = ""
            }

        }
        const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("Check DMs!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
        
            
        }
        else {
            var found_item = 0;
            Item.forEach(i => {
            if (item.toLowerCase() === i[0].toLowerCase()) {
                found_item = 1;
            }
        });
        if (found_item === 0) {
            interaction.reply("You have entered an invalid item name!");
            return;
        }

        for (let i = 0; i < Item.length; i++) {
            if (Item[i][0].toLowerCase() === item.toLowerCase()) {

                market.push(Item[i][0], Math.round(Item[i][1]*100)/100, Item[i][2])
                strMarket += ("$" + market[1] + " - 📦" + market[2])
                const embed = new EmbedBuilder()
                .setTitle(market[0])
                .setDescription(strMarket)
                .setColor('#FFFF00')
                interaction.reply({embeds: [embed]})
                return;
            }
            

            }

            console.log("Couldn't find item " + item + "!")
            return;
        
        }
        synchronizeServerData(interaction.guild.id)
    
    }

    if (interaction.commandName === "buy") {
        var item = interaction.options.get("item").value;
        var amount = interaction.options.get("amount")?.value;
        amount = amount === undefined ? 1 : amount;

        if (amount <= 0) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You have to buy a positive amount!")
                .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return
        }

        var itemAmount = 0
        for (let i = 0; i < PlayerItem.length; i++) {
            if (PlayerItem[i][0] === Player[userIndex][0]) {
                itemAmount += PlayerItem[i][2]
            }
        }
        if ((itemAmount + amount) > 50) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You may not get more than 50 items in your inventory when using /buy")
                .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }

        var found_item = 0;
        for (let i = 0; i < Item.length; i++) {
            
        }
        for (let i = 0; i < items.length; i++) {
            if (item.toLowerCase() === items[i].toLowerCase()) {
                found_item = 1;
                item = items[i]
            }
        }
        
        if (found_item === 0) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You have entered an invalid item name!")
                .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }

        let payedPrice = getBuyPrice(item, amount)
        if (Player[userIndex][1] < payedPrice) { // If the Player-money is less than the cost of the item
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("This transaction would cost $" + Math.round(payedPrice*100)/100 + ". You don't have enough money for that! (Current money: $" + Math.round(Player[userIndex][1]*100)/100 + ")")
                .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        let itemStockpile = getItemStockpile(item)
        if (amount > itemStockpile) { // If the item-stockpile isn't large enough for the purchase-request
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("The " + item + " stockpile is only at " + itemStockpile + " at the moment!")
                .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just bought " + amount + "x " + item + " for $" + Math.round(payedPrice * 100)/100)
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
        buyItem(userIndex, item, amount)
            
        synchronizeServerData(interaction.guild.id)
    }
    
    if (interaction.commandName === "sell") {
        var item = interaction.options.get("item").value;
        var amount = interaction.options.get("amount")?.value;
        amount = amount === undefined ? 1 : amount;

        if (amount <= 0) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You have to sell a positive amount!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return
        }

        var found_item = 0;
        items.forEach(i => {
            if (item.toLowerCase() === i.toLowerCase()) {
                found_item = 1;
                item = i
            }
        });
        if (found_item === 0) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You have entered an invalid item name!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }

        piIndex = getPlayerItemIndex(userIndex, item)
        if (PlayerItem[piIndex][2] < amount) { // Player has less items in the inventory as he wants to sell
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You don't have enough items for that!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        priceYielded = getSellPrice(item, amount)
        const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just sold " + amount + "x " + item + " for $" + Math.round(priceYielded * 100)/100)
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
        sellItem(userIndex, item, amount)
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "setmoney") {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an admin!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        
        var user = interaction.options.get("user").user;
        var value = interaction.options.get("value").value;
        index = getPlayerIndexByID(user.id)
        var money = Player[index][1];
        var debt = Player[index][2];
        money = value;
        if (money < 0) {
            debt -= money;
            money = 0;
        }
        const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription(user.username + " now has $" + Math.round(money*100)/100 + " in money and $" + Math.round(debt*100)/100 + " in debt!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
        Player[index][1] = money
        Player[index][2] = debt
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "save") {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an admin! The game will save every 5 minutes automatically!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        
        if (saveCooldown.includes(userID)) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("Saving the game has a five minute cooldown!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return
        }

        saveCooldown.push(userID)
        setTimeout(() => {
            saveCooldown.shift();
        }, 300000) // time in ms
        for (let i = 0; i < servers.length; i++) {
        savePlayerData(servers[i])
        savePlayerItemData(servers[i])
        saveItemData(servers[i])
        saveCompanyData(servers[i])
        saveCompanyItemData(servers[i])

        }
        
        const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("Saved the game!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "leaderboard") {
        var playerData = [] 
        
        Player.forEach((player, index) => {
            const money = player[1];
            const debt = player[2];
            const capital = Company[getCompanyIndex(index)] === undefined ? 0 : Company[getCompanyIndex(index)][3]
            playerData.push([player[0], money + capital - debt]); // Add net worth as the last element in each sub-array
          });

        playerData.sort((a, b) => b[1] - a[1]);

        const numberOfTopPlayersToShow = Math.min(Player.length,20);
        playerData = removeDuplicates(playerData)
        var leaderboard = playerData.slice(0, numberOfTopPlayersToShow);
        leaderboard.push()
        

        console.log(leaderboard)
        
        var message = ""

        leaderboard.forEach((player, index) => {
        let name = ""
        for (let i = 0; i < idWithName.length; i++) {
            if (idWithName[i][0] === player[0]) {
                name = idWithName[i][1]
            }
        }
        if (player[1] >= 0) {
            message += `\n${index + 1}. ${name}, Networth: $${Math.round(player[1]*100)/100}`;
        }
        else {
            message += `\n${index + 1}. ${name}, Networth: -$${Math.round(-player[1]*100)/100}`;
        }
        });
        const embed = new EmbedBuilder()
                .setTitle("Leaderboard:")
                .setDescription(message)
                .setColor('#FFFF00')
                interaction.reply({embeds: [embed]})
        synchronizeServerData(interaction.guild.id)
    }


    if (interaction.commandName === "addmoney") {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an admin!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        var user = interaction.options.get("user").user;
        var value = interaction.options.get("value").value;
        index = getPlayerIndexByID(user.id)
        var money = Player[index][1];
        var debt = Player[index][2];
        money += value;
        if (money < 0) {
            debt -= money;
            money = 0;
        }
        const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription(user.username + " now has $" + Math.round(money*100)/100 + " in money and $" + Math.round(debt*100)/100 + " in debt!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
        Player[index][1] = money
        Player[index][2] = debt
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "setsupply") {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an admin!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        var item = interaction.options.get("item").value;
        var value = interaction.options.get("value").value;
        itemIndex = getItemIndex(item)
        
        if (value < 0) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("The value must be positive or zero!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        for (let i = 0; i < Item.length; i++) {
            if (Item[i][0].toLowerCase() === item.toLowerCase()) {
                item = Item[i][0].toLowerCase()
                found_item = 1;
                stockpile = value;
                const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("The item " + item + " is now available " + stockpile + " times!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
                Item[itemIndex][2] = stockpile
                return
            }
        }
        const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You have entered an invalid item name!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "setprice") {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an admin!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        var item = interaction.options.get("item").value;
        var value = interaction.options.get("value").value;
        var price = Item[itemIndex][1];

        if (value <= 0) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("The value must be positive!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        var found_item = 0;
        for (let i = 0; i < Item.length; i++) {
            if (Item[i][0].toLowerCase() === item.toLowerCase()) {
                item = Item[i][0].toLowerCase()
                found_item = 1;
                price = value;
                const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("The item " + item + " now costs $" + price + "!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
                Item[i][1] = price
            }
        }
        if (found_item === 0) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You have entered an invalid item name!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "setdebt") {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an admin!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        var user = interaction.options.get("user").user;
        var value = interaction.options.get("value").value;
        var debt = Player[userIndex][2];
        debt = value;
        if (debt < 0) {
            debt = 0;
        }
        const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription(user.username + " now is $" + debt + " in debt!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
        Player[userIndex][2] = debt
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "adddebt") {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an admin!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        var user = interaction.options.get("user").user;
        var value = interaction.options.get("value").value;
        var debt = Player[userIndex][2];
        debt += value;
        if (debt < 0) {
            debt = 0;
        }
        const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription(user.username + " now is $" + debt + " in debt!")
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
        Player[userIndex][2] = debt
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "bailout") {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an admin!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        var mindebt = interaction.options.get("mindebt").value;
        var useramount = interaction.options.get("useramount").value;
        bailoutCandidates = [];
        for (let i = 0; i < Player.length; i++) {
            if (Player[i][2] >= mindebt) { // If the user has at least the required amount of debt in order to be qualified for bailout
                bailoutCandidates.push(Player[i]);
                
            }
        }
        if (bailoutCandidates.length === 0) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("There are no users who match your criteria")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return
        }
        if (useramount > bailoutCandidates.length) {
            console.log(bailoutCandidates)
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("There are only " + bailoutCandidates.length + " users with more than $" + mindebt + " debt!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        if (useramount <= 0) {
            console.log(bailoutCandidates)
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("The amount of users specified must be positive!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        if (bailoutCandidates.length > 0) {
            
        strBailouted = "The following users were bailouted and their debt set to 0:"
        for (let i = 0; i < useramount; i++) {
            j = getRandomNumberBetween(0,bailoutCandidates.length-1) // Random value from 0 to end of bailoutCandidates: Generate random users
            var userID = bailoutCandidates[j][0]
            Player[getPlayerIndexByID(userID)][2] = 0 // Setting the debt to 0
            var username = "";
            for (let k = 0; k < idWithName.length; k++) {
                if (userID === idWithName[k][0]) {
                    username = idWithName[k][1];
                }
            }
            strBailouted += ("\n" + username)
            bailoutCandidates.splice(j, 1);
        }
        const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription(strBailouted)
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
        }
        synchronizeServerData(interaction.guild.id)
    }
    if (interaction.commandName === "additem") {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an admin!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        var user = interaction.options.get("user").user;
        var item = interaction.options.get("item").value;
        var amount = interaction.options.get("amount")?.value;
        amount = amount === undefined ? 1 : amount;

        var found_item = 0;
        for (let i = 0; i < Item.length; i++) {
            if (Item[i][0].toLowerCase() === item.toLowerCase()) {
                item = Item[i][0]
                found_item = 1;
            }
        }
        if (found_item === 0) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You have entered an invalid item name!")
                .setColor('#FF0000')
                interaction.reply({embeds: [embed]})
            return;
        }
        
        const embed = new EmbedBuilder()
                .setTitle("Success!")
                .setDescription("You just added " + amount + "x " + item + " to " + user.username)
                .setColor('#00FF00')
                interaction.reply({embeds: [embed]})
        if (user != undefined || user != null) {
            userIndex = getPlayerIndexByID(user.id)
        }
        addItem(userIndex, item, amount)
        synchronizeServerData(interaction.guild.id)
    }

    if (interaction.commandName === "buymaterials") {
        var companyIndex = getCompanyIndex(userIndex)
        if (companyIndex === false) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You are not an entrepreneur!")
                .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        var item = interaction.options.get("item").value;
        var amount = interaction.options.get("amount")?.value;
        amount = amount === undefined ? 1 : amount;

        var found_item = 0;
        items.forEach(i => {
            if (item.toLowerCase() === i.toLowerCase()) {
                found_item = 1;
                item = i
            }
        });
        if (found_item === 0) {
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("You have entered an invalid item name!")
                .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }
        let payedPrice = 0
        let ingredients = getIngredients(item)
        ingredients = ingredients.split(",")
        for (let x = 0; x < ingredients.length; x++) {
            ingredients[x] = ingredients[x].split(":")
        }

        for (let a = 0; a < amount; a++) {
            for (let x = 0; x < ingredients.length; x++) {
                ingredients[x][1] = Math.floor(ingredients[x][1]) // Converts String to Int
                payedPrice += getBuyPrice(ingredients[x][0], ingredients[x][1])
                for (let i = 0; i < Item.length; i++) {
                    if (Item[i][0] === ingredients[x][0]) {
                        if (ingredients[x][1] * amount > Item[i][2]) { // If the amount of a certain ingredient needed is larger than the stockpile of said item
                            const embed = new EmbedBuilder()
                                .setTitle("Error!")
                                .setDescription("You would need " + ingredients[x][1] * amount + "x " + ingredients[x][0] + "! The current market stockpile is only at " + Item[i][2])
                                .setColor('#FF0000')
                            interaction.reply({embeds: [embed]})
                            return;
                        }
                    }
                }
            }
        }
        

        

        if (Company[companyIndex][3] < payedPrice) { // If the Company-capital is less than the cost of the item
            const embed = new EmbedBuilder()
                .setTitle("Error!")
                .setDescription("This transaction would cost $" + Math.round(payedPrice*100)/100 + ". You don't have enough capital for that! (Current capital: $" + Math.round(Company[companyIndex][1]*100)/100 + ")")
                .setColor('#FF0000')
            interaction.reply({embeds: [embed]})
            return;
        }

        const embed = new EmbedBuilder()
        .setTitle("Success!")
        .setDescription("You just bought all ingredients for " + amount + "x " + item + " for $" + Math.round(payedPrice * 100)/100)
        .setColor('#00FF00')
        interaction.reply({embeds: [embed]})

        for (let i = 0; i < ingredients.length; i++) {
            companyBuyItem(companyIndex, ingredients[i][0], ingredients[i][1])
        }
        

    }
    
    

});

client.login(process.env.TOKEN);