const axios = require("axios");

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('utility')
		.setDescription('Some useful commands.')

		// Ping command
		.addSubcommand(subcommand =>
			subcommand
				.setName('ping')
				.setDescription('Replies with \'pong\' and your current latency!'))

		// Cryptocurrency info command
		.addSubcommand(subcommand =>
			subcommand
				.setName('cryptocurrency')
				.setDescription('Spew out some stats on cryptocurrencies.')
				.addStringOption(option =>
					option.setName('cryptocurrency')
						.setDescription('The cryptocurrencies I currently support')
						.setRequired(true)
						// Some cryptocurrencies
						.addChoice('Avalanche', 'avalanche-2')
						.addChoice('Bitcoin', 'bitcoin')
						.addChoice('Dogecoin', 'dogecoin')
						.addChoice('Ethereum', 'ethereum')
						.addChoice('Polkadot', 'polkadot')
						.addChoice('Polygon', 'matic-network')
						.addChoice('Solana', 'solana'))),

	async execute(interaction) {

		if (interaction.options.getSubcommand() === 'ping') {
			const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
			interaction.editReply(`:ping_pong: Pong! Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
		}

		if (interaction.options.getSubcommand() === 'cryptocurrency') {
			const id = interaction.options.getString('cryptocurrency');
			let response = null;
	
			new Promise(async (resolve, reject) => {
			  try {
			    response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`);
			  } catch(ex) {
			    response = null;
			    // Error logging
			    console.log(ex);
			    reject(ex);
			  }
			  if (response) {
			    // Upon success
			    const json = response.data;
			    const result = JSON.parse(json);
			    var final = "**" + id + "**\n"
			    for (var i = 0, res; i < 5; i++)  
				final += result[id][Object.keys(result)[i]] + "\n"
		 	    await interaction.reply(final)
			    resolve(json);
			  }
			});
		}

	},
};
