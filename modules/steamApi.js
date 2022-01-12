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

function checkStatus(status) {
	switch (status) {
	case 0:
		return 'Desconectado/Perfil privado';
	default:
		return 'Conectado';
	}
}

function checkGModOwnership(data) {
	let d = data.response.games;
	const GMData = d.find(o => o.appid === 4000);
	if (GMData == null) {
		return 'Family Sharing';
	}
	const playtimeHours = GMData.playtime_forever/60;
	return Math.round(playtimeHours).toString();
}

module.exports = {
	fetchBasicProfileInfo,
	fetchSteamLevel,
	fetchGMstats,
	checkStatus,
	checkGModOwnership
};