const { cfg } = require('../modules/configLoader.js');
const axios = require('axios');

const steamAPI = cfg.steamApi;

async function fetchProfileInfo(steamid) {
	let data;
	await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamAPI}&steamids=${steamid}`)
		.then(response => {
			data = response.data;
			console.log(data)
		});
	return data;
}

module.exports = {
	fetchProfileInfo
};