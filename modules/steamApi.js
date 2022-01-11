const { cfg } = require('../modules/configLoader.js');
const axios = require('axios');

const steamAPI = cfg.steamApi;

async function fetchBasicProfileInfo(steamid) {
	let data;
	await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamAPI}&steamids=${steamid}`)
		.then(response => {
			data = response.data;
			console.log(data)
		});
	return data;
}

async function fetchSteamLevel(steamid) {
	let data;
	await axios.get(`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${steamAPI}&steamid=${steamid}`)
		.then(response => {
			data = response.data;
			console.log(data);
		});
	return data;
}

async function fetchGMstats(steamid) {
	let data;
	await axios.get(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${steamAPI}&steamid=${steamid}&include_appinfo=0`)
		.then(response => {
			data = response.data;
			console.log(data);
		});
	return data;
}

module.exports = {
	fetchBasicProfileInfo,
	fetchSteamLevel,
	fetchGMstats
};