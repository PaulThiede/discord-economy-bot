require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");

const commands = [
    {
        name: 'help',
        description: 'Provides you with a list of all commands and their descriptions.'
    },
    {
        name: 'ping',
        description: 'Pong!'
    },
    {
        name: 'stats',
        description: 'Tells you everything about a user. If no user-id is provided, it will show your stats',
        options: [
            {
                name: "user",
                description: "The stats of the user you wish to see the stats of",
                type: ApplicationCommandOptionType.Mentionable
            }
        ]
    },
    {
        name: 'items',
        description: 'Provides you with a list of all items in the game.'
    },

    {
        name: 'chop',
        description: 'Used by lumberjacks to chop down trees.'
    },

    {
        name: 'mine',
        description: 'Used by miners to mine resources.'
    },

    {
        name: 'farm',
        description: 'Used by farmers to harvest crops.',
        options: [
            {
                name: "item",
                description: "The item you want to farm",
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: "grain",
                        value: "Grain"
                    },
                    {
                        name: "wool",
                        value: "Wool"
                    },
                    {
                        name: "fish",
                        value: "Fish"
                    },
                    {
                        name: "leather",
                        value: "Leather"
                    }
                ]
            }
        ]
    },

    {
        name: 'harvest',
        description: 'Used by special jobs to harvest their unique resource.'
    },

    {
        name: 'work',
        description: 'Used by workers to produce a certain item, if the ingredients are available.',
        options: [
            {
            name: "item",
            description: "The item you want to produce",
            type: ApplicationCommandOptionType.String,
            required: true
            }
        ]
    },

    {
        name: 'job',
        description: 'Used by anyone to change which job they have',
        options: [
            {   
                name: "job-type",
                description: "Which job you want to choose",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "lumberjack",
                        description: "Chops down trees to get wood and rubber.",
                        value: "Lumberjack"
                    },
                    {
                        name: "miner",
                        description: "Mines resources to get iron, minerals, coal and phosphorus",
                        value: "Miner"
                    },
                    {
                        name: "farmer",
                        description: "Harvests crops to get grain, leather, fish and wool",
                        value: "Farmer"
                    },
                    {
                        name: "special-job-water",
                        description: "Filters water to make drinkable water for everyone",
                        value: "Special Job: Water"
                    },
                    {
                        name: "special-job-natural-gas",
                        description: "Acquires natural gas from special facilities",
                        value: "Special Job: Natural Gas"
                    },
                    {
                        name: "special-job-petroleum",
                        description: "Pumps petroleum from oil fields",
                        value: "Special Job: Petroleum"
                    },
                    {
                        name: "worker",
                        description: "Works in a company. For this to work, be sure to join a company with /join",
                        value: "Worker"
                    },
                    {
                        name: "entrepreneur",
                        description: "Creates his own company. For this to work, be sure to create a company with /company create",
                        value: "Entrepreneur"
                    },
                    {
                        name: "jobless",
                        description: "Quits every job. You won't be able to work in any way.",
                        value: ""
                    },
                ]
            }
        ]
    },

    {
        name: 'setitems',
        description: 'Used by entrepreneurs to set what five items the workers can produce. Separate items using commas.',
        options: [
            {
                name: 'item1',
                description: 'The first item you wish your company to produce',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'item2',
                description: 'The second item you wish your company to produce',
                type: ApplicationCommandOptionType.String,
                
            },
            {
                name: 'item3',
                description: 'The third item you wish your company to produce',
                type: ApplicationCommandOptionType.String,
                
            },
            {
                name: 'item4',
                description: 'The fourth item you wish your company to produce',
                type: ApplicationCommandOptionType.String,
                
            },
            {
                name: 'item5',
                description: 'The fifth item you wish your company to produce',
                type: ApplicationCommandOptionType.String,
                
            }

        ]
    },

    {
        name: 'company',
        description: "Used to do certain actions in the company you're working in",
        options: [
                    {
                    
                        name: "sell",
                        value: "sell",
                        description: "Used by entrepreneurs to sell ONE item from the item stockpile of the company to the market.",
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: "item",
                                description: "The item you want to sell",
                                type: ApplicationCommandOptionType.String,
                                required: true

                            }
                        ]
                    },
                    {
                    
                        name: "buy",
                        value: "buy",
                        description: "Used by the entrepreneur to buy items from the market.",
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: "item",
                                description: "The item you want to buy",
                                type: ApplicationCommandOptionType.String,
                                required: true

                            },
                            {
                                name: "amount",
                                description: "The amount you want to buy",
                                type: ApplicationCommandOptionType.Integer,
                                required: false

                            },
                        ]
                    },
                    {
                        name: "info",
                        value: "info",
                        type: ApplicationCommandOptionType.Subcommand,
                        description: "Used either by workers or entrepreneurs to view important information about their company.",
                        
                    },
                    {
                        name: "deposit",
                        value: "deposit",
                        type: ApplicationCommandOptionType.Subcommand,
                        description: "Used by entrepreneurs to deposit money to the company-account.",
                        options: [
                            {
                                name: "value",
                                description: "The amount of money you want to deposit",
                                type: ApplicationCommandOptionType.Number,
                                required: true

                            }
                        ]
                    },
                    {
                        name: "withdraw",
                        value: "withdraw",
                        description: "Used by entrepreneurs to withdraw money from the company-account.",
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: "value",
                                description: "The amount of money you want to withdraw",
                                type: ApplicationCommandOptionType.Number,
                                required: true

                            }
                        ]
                    },
                    {
                        name: "create",
                        value: "create",
                        description: "Used by users to create a company if they don't have a job. Costs $1000",
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: "name",
                                description: "The name of the company you want to create",
                                type: ApplicationCommandOptionType.String,
                                required: true

                            }
                        ]
                    },
                    {
                        name: "disband",
                        value: "disband",
                        description: "Used by entrepreneurs to disband their company.",
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: "user",
                                description: "The user you want to disband the company of (only for admins)",
                                type: ApplicationCommandOptionType.Mentionable,
                                required: false
                            }
                        ]
                    },
                ]

    },
    {
        name: 'setwage',
        description: 'Used by entrepreneurs to set how much money the workers make for every time they work or per hour',
        options: [
            {
                name: "value",
                description: "How much workers earn each time they work or every hour",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: 'hire',
        description: 'Used by entrepreneurs to accept the hire-request of a user',
        options: [
            {
                name: "user",
                description: "Which user you want to accept into your company",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            }
        ]
    },
    {
        name: 'fire',
        description: 'Used by entrepreneurs to fire a worker from the company.',
        options: [
            {
                name: "user",
                description: "How much workers earn each time they work or every hour",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            },
            {
                name: "reason",
                description: "For which reason you want to fire the user",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "abuse",
                        value: "abuse"
                    },
                    {
                        name: "inactivity",
                        value: "inactivity"
                    },
                    {
                        name: "bankruptcy",
                        value: "bankruptcy"
                    },
                    {
                        name: "behavior",
                        value: "behavior"
                    },
                ]
            }
        ]
    },
    {
        name: 'join',
        description: 'Used by users to ask to join a company of an entrepreneur, who has to accept the request.',
        options: [
            {
                name: "user",
                description: "The entrepreneur who you want to join",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            }
        ]
    },
    {
        name: 'leavejob',
        description: 'Used by workers to leave the company that they work in. Can only be used every 5 days.',
        
    },
    {
        name: 'customize',
        description: 'Used by entrepreneurs to customize certain aspects of their company',
        options: [
            {
                name: "paymenttype",
                description: "Choose the payment type of your company",
                type: ApplicationCommandOptionType.SubcommandGroup,
                options: [
                    {
                        name: "interval",
                        description: "People are paid every hour",
                        type: ApplicationCommandOptionType.Subcommand
                    },
                    {
                        name: "work",
                        description: "People are paid every time they work",
                        type: ApplicationCommandOptionType.Subcommand
                    },
                ]
            },
            {
                name: "name",
                description: "Change the name of your company",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "name",
                        description: "What name your company should have",
                        type: ApplicationCommandOptionType.String,
                        required: true
                    }
                ]
            }
        ]
    },
    {
        name: 'gift',
        description: 'Used by anyone to gift money to someone. 1h cooldown and $10000 max amount.',
        options: [
            {
                name: "user",
                description: "The user you want to gift money",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            },
            {
                name: "value",
                description: "The amount of money you want to gift",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: 'loan',
        description: 'Used by anyone to take a loan. Maximum $10000. You get 10% interest each day.',
        options: [
            {
                name: "value",
                description: "The amount of money you want to loan",
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    },
    {
        name: 'paydebt',
        description: 'Used by anyone to pay back debt using their money.',
        options: [
            {
                name: "value",
                description: "The amount of money you want to pay back",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: 'drink',
        description: 'Consumes 1 water from your inventory and fills up your thirst bar.',
    },
    {
        name: 'eat',
        description: 'Consumes 1 grocery from your inventory and fills up your hunger bar.',
    },
    {
        name: 'consume',
        description: 'Consumes an item from the inventory and applies the corresponding effects',
        options: [
            {
                name: "item",
                description: "The item you want to consume",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "Water",
                        value: "Water"
                    },
                    {
                        name: "Grocery",
                        value: "Grocery"
                    },
                    {
                        name: "Fish",
                        value: "Fish"
                    },
                ]
            }
        ]
    },
    {
        name: 'marketinfo',
        description: 'Used by anyone to receive information about the market.',
        options: [
             {
                name: "item",
                description: "The item you want to see the info of",
                type: ApplicationCommandOptionType.String,
             }
        ]
    },
    {
        name: 'buy',
        description: 'Buys items directly from the market. If no amount is specified, one item will be bought.',
        options: [
            {
                name: "item",
                description: "The item you want to buy",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "amount",
                description: "The amount you want to buy of your specified item",
                type: ApplicationCommandOptionType.Integer
            }
        ]
    },
    {
        name: 'sell',
        description: 'Sells items directly to the market. If no amount is specified, one item will be sold.',
        options: [
            {
                name: "item",
                description: "The item you want to sell",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "amount",
                description: "The amount you want to sell of your specified item",
                type: ApplicationCommandOptionType.Number
            }
        ]
    },
    {
        name: 'setmoney',
        description: 'Sets the money of a user. A negative value corresponds to debt.',
        options: [
            {
                name: "user",
                description: "The user you want to modify the money of",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            },
            {
                name: "value",
                description: "The amount of money you want the user to have",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: 'addmoney',
        description: 'Adds money to a user. Can be negative.',
        options: [
            {
                name: "user",
                description: "The user you want to modify the money of",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            },
            {
                name: "value",
                description: "The amount of money you want to add to the user",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: 'setsupply',
        description: 'Sets the supply of an item in the marketplace. Must be positive or 0.',
        options: [
            {
                name: "item",
                description: "The item you want to modify the stockpile of",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "value",
                description: "The stockpile you want the item to have",
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    },
    {
        name: 'setprice',
        description: 'Sets the price of an item in the marketplace. Must be positive.',
        options: [
            {
                name: "item",
                description: "The item you want to modify the price of",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "value",
                description: "The price you want the item to have",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: 'setdebt',
        description: 'Sets the debt of a user.',
        options: [
            {
                name: "user",
                description: "The user you want to modify the debt of",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            },
            {
                name: "value",
                description: "The amount of debt you want the user to have. Negative amounts are nullified.",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: 'adddebt',
        description: 'Adds debt to a user. Use negative numbers to remove debt.',
        options: [
            {
                name: "user",
                description: "The user you want to modify the debt of",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            },
            {
                name: "value",
                description: "The amount of debt you want to add to the user",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: 'bailout',
        description: 'Used to set the debt of specified users to 0.',
        options: [
            {
                name: "mindebt",
                description: "The minimum amount of debt users must have to get a chance for bailout",
                type: ApplicationCommandOptionType.Number,
                required: true
            },
            {
                name: "useramount",
                description: "The amount of users that will be bailouted.",
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    },
    {
        name: 'additem',
        description: 'Adds an item to a user. If no amount is specified, one item is added.',
        options: [
            {
                name: "user",
                description: "The user you want to give an item",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            },
            {
                name: "item",
                description: "Which item is added to the user",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "amount",
                description: "How many items are added to the user",
                type: ApplicationCommandOptionType.Integer,
                required: false
            }
        ]
    },
    {
        name: 'removeitem',
        description: 'Removes an item from a user. If no amount is specified, one item is removed.',
        options: [
            {
                name: "user",
                description: "The user you want to remove an item from",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            },
            {
                name: "item",
                description: "Which item is removed from the user",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "amount",
                description: "How many items are removed from the user",
                type: ApplicationCommandOptionType.Integer,
                required: false
            }
        ],
    },
    {
        name: 'save',
        description: 'Saves the progess to the database',
    },
    {
        name: 'leaderboard',
        description: 'Shows who own the most money minus the debt',
    },
    {
        name: 'ingredients',
        description: 'Shows you which ingredients you need for a certain item',
        options: [
            {
                name: "item",
                description: "The item you want to see the ingredients of",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'buymaterials',
        description: 'Used by entrepreneurs to try to buy all necessary ingredients of an item',
        options: [
            {
                name: "item",
                description: "The item you want buy the ingredients of",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "amount",
                description: "How many times you want to be able to produce that item",
                type: ApplicationCommandOptionType.Integer,
                required: false
            }
        ]
    }

    
];

const rest = new REST({ version: '10'}).setToken(process.env.TOKEN);

var servers = ["1061252848446361660", "647540631367057429", "675732197839339610"];

(async () => {
    try {
        console.log('Registering slash commands...')

        for (let i = 0; i < servers.length; i++) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, servers[i]),
                { body: commands}
            )
        }


        console.log('Slash commands were registered successfully!')
    } catch (error) {
        console.log(`An error occured: ${error}`);
    }
})();

