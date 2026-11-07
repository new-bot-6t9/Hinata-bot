// set bash title
process.stdout.write("\x1b]2;Goat Bot V2 - Made by NTKhang\x1b\x5c");
const defaultRequire = require;

const gradientLib = defaultRequire("gradient-string");
const gradient = gradientLib.default || gradientLib;
const axios = defaultRequire("axios");
const path = defaultRequire("path");
const readline = defaultRequire("readline");
const fs = defaultRequire("fs-extra");
const { TOTP } = defaultRequire("totp-generator");
const login = defaultRequire("neokex-fca");
const qr = new (defaultRequire("qrcode-reader"));
const Canvas = defaultRequire("canvas");

async function getName(userID) {
	try {
		const info = await global.GoatBot.fcaApi.getUserInfo(String(userID));
		const user = info && info[String(userID)];
		return user && user.name ? user.name : null;
	}
	catch (error) {
		return null;
	}
}

const { writeFileSync, readFileSync, existsSync, watch } = require("fs-extra");
const handlerWhenListenHasError = require("./handlerWhenListenHasError.js");
const checkLiveCookie = require("./checkLiveCookie.js");
const { callbackListenTime, storage5Message } = global.GoatBot;
const { log, logColor, getPrefix, createOraDots, jsonStringifyColor, getText, convertTime, colors, randomString } = global.utils;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const currentVersion = require(`${process.cwd()}/package.json`).version;

function centerText(text, length) {
	const width = process.stdout.columns;
	const leftPadding = Math.floor((width - (length || text.length)) / 2);
	const rightPadding = width - leftPadding - (length || text.length);
	const paddedString = ' '.repeat(leftPadding > 0 ? leftPadding : 0) + text + ' '.repeat(rightPadding > 0 ? rightPadding : 0);
	console.log(paddedString);
}
// logo
const titles = [
	[
		"██████╗  ██████╗  █████╗ ████████╗    ██╗   ██╗██████╗",
		"██╔════╝ ██╔═══██╗██╔══██╗╚══██╔══╝    ██║   ██║╚════██╗",
		"██║  ███╗██║   ██║███████║   ██║       ██║   ██║ █████╔╝",
		"██║   ██║██║   ██║██╔══██║   ██║       ╚██╗ ██╔╝██╔═══╝",
		"╚██████╔╝╚██████╔╝██║  ██║   ██║        ╚████╔╝ ███████╗",
		"╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝         ╚═══╝  ╚══════╝"
	],
	[
		"█▀▀ █▀█ ▄▀█ ▀█▀  █▄▄ █▀█ ▀█▀  █░█ ▀█",
		"█▄█ █▄█ █▀█ ░█░  █▄█ █▄█ ░█░  ▀▄▀ █▄"
	],
	[
		"G O A T B O T  V 2 @" + currentVersion
	],
	[
		"GOATBOT V2"
	]
];
const maxWidth = process.stdout.columns;
const title = maxWidth > 58 ?
	titles[0] :
	maxWidth > 36 ?
		titles[1] :
		maxWidth > 26 ?
			titles[2] :
			titles[3];
console.log(gradient("#f5af19", "#f12711")(createLine(null, true)));
console.log();
for (const text of title) {
	const textColor = gradient("#FA8BFF", "#2BD2FF", "#2BFF88")(text);
	centerText(textColor, text.length);
}
let subTitle = `GoatBot V2@${currentVersion}- A simple Bot chat messenger use personal account`;
const subTitleArray = [];
if (subTitle.length > maxWidth) {
	while (subTitle.length > maxWidth) {
		let lastSpace = subTitle.slice(0, maxWidth).lastIndexOf(' ');
		lastSpace = lastSpace == -1 ? maxWidth : lastSpace;
		subTitleArray.push(subTitle.slice(0, lastSpace).trim());
		subTitle = subTitle.slice(lastSpace).trim();
	}
	subTitle ? subTitleArray.push(subTitle) : '';
}
else {
	subTitleArray.push(subTitle);
}
const author = ("Created by NTKhang with ♡");
const srcUrl = ("Source code: https://github.com/ntkhang03/Goat-Bot-V2");
const fakeRelease = ("ALL VERSIONS NOT RELEASED HERE ARE FAKE");
for (const t of subTitleArray) {
	const textColor2 = gradient("#9F98E8", "#AFF6CF")(t);
	centerText(textColor2, t.length);
}
centerText(gradient("#9F98E8", "#AFF6CF")(author), author.length);
centerText(gradient("#9F98E8", "#AFF6CF")(srcUrl), srcUrl.length);
centerText(gradient("#f5af19", "#f12711")(fakeRelease), fakeRelease.length);

let widthConsole = process.stdout.columns;
if (widthConsole > 50)
	widthConsole = 50;

function createLine(content, isMaxWidth = false) {
	if (!content)
		return Array(isMaxWidth ? process.stdout.columns : widthConsole).fill("─").join("");
	else {
		content = ` ${content.trim()} `;
		const lengthContent = content.length;
		const lengthLine = isMaxWidth ? process.stdout.columns - lengthContent : widthConsole - lengthContent;
		let left = Math.floor(lengthLine / 2);
		if (left < 0 || isNaN(left))
			left = 0;
		const lineOne = Array(left).fill("─").join("");
		return lineOne + content + lineOne;
	}
}
const character = createLine();

const clearLines = (n) => {
	for (let i = 0; i < n; i++) {
		const y = i === 0 ? null : -1;
		process.stdout.moveCursor(0, y);
		process.stdout.clearLine(1);
	}
	process.stdout.cursorTo(0);
	process.stdout.write('');
};

async function input(prompt, isPassword = false) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	if (isPassword)
		rl.input.on("keypress", function () {
			const len = rl.line.length;
			readline.moveCursor(rl.output, -len, 0);
			readline.clearLine(rl.output, 1);
			for (let i = 0; i < len; i++) {
				rl.output.write("*");
			}
		});

	return new Promise(resolve => rl.question(prompt, ans => {
		rl.close();
		resolve(ans);
	}));
}
	qr.readQrCode = async function (filePath) {
	const image = await Canvas.loadImage(filePath);
	const canvas = Canvas.createCanvas(image.width, image.height);
	const ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0, 0);
	const data = ctx.getImageData(0, 0, image.width, image.height);
	let value;
	qr.callback = function (error, result) {
		if (error)
			throw error;
		value = result;
	};
	qr.decode(data);
	return value.result;
};

const { dirAccount } = global.client;
const { facebookAccount } = global.GoatBot.config;

function sendJson(res, statusCode, payload) {
	const body = JSON.stringify(payload, null, 2);
	res.writeHead(statusCode, {
		"Content-Type": "application/json; charset=utf-8",
		"Cache-Control": "no-store"
	});
	res.end(body);
}

function responseUptimeSuccess(req, res) {
	sendJson(res, 200, {
		status: "success",
		message: "Bot is running",
		botID: global.GoatBot.botID || global.botID || null,
		statusAccountBot: global.statusAccountBot || "good",
		uptime: process.uptime(),
		unit: "seconds"
	});
}
function checkAndTrimString(string) {
	if (typeof string == "string")
		return string.trim();
	return string;
}

function filterKeysAppState(appState) {
	return appState.filter(item => ["c_user", "xs", "datr", "fr", "sb", "i_user"].includes(item.key));
}

function pushI_user(appState, value) {
	appState.push({
		key: "i_user",
		value: value || facebookAccount.i_user,
		domain: "facebook.com",
		path: "/",
		hostOnly: false,
		creation: new Date().toISOString(),
		lastAccessed: new Date().toISOString()
	});
	return appState;
}

function isNetScapeCookie(cookie) {
	if (typeof cookie !== 'string')
		return false;
	return /(.+)\t(1|TRUE|true)\t([\w\/.-]*)\t(1|TRUE|true)\t\d+\t([\w-]+)\t(.+)/i.test(cookie);
}

function netScapeToCookies(cookieData) {
	const cookies = [];
	const lines = cookieData.split('\n');
	lines.forEach((line) => {
		if (line.trim().startsWith('#')) {
			return;
		}
		const fields = line.split('\t').map((field) => field.trim()).filter((field) => field.length > 0);
		if (fields.length < 7) {
			return;
		}
		cookies.push({
			key: fields[5],
			value: fields[6],
			domain: fields[0],
			path: fields[2],
			hostOnly: fields[1] === 'TRUE',
			creation: new Date(fields[4] * 1000).toISOString(),
			lastAccessed: new Date().toISOString()
		});
	});
	return cookies;
}
let spin;

global.responseUptimeCurrent = responseUptimeSuccess;
global.responseUptimeSuccess = responseUptimeSuccess;
global.responseUptimeError = responseUptimeError;

global.statusAccountBot = 'good';
let changeFbStateByCode = false;
let latestChangeContentAccount = fs.statSync(dirAccount).mtimeMs;
let uptimeServerRunning = false;

// Read the 2FA secret/code from config. The value may point at a QR image.
async function get2FASecret(facebookAccount) {
	let code2FATemp = facebookAccount["2FASecret"];
	if (!code2FATemp)
		return "";
	if (['.png', '.jpg', '.jpeg'].some(i => code2FATemp.endsWith(i)))
		code2FATemp = (await qr.readQrCode(`${process.cwd()}/${code2FATemp}`)).replace(/.*secret=(.*)&digits.*/g, '$1');
	return code2FATemp;
}

function normalizeTotpSecret(secret) {
	return secret.normalize("NFD")
		.toLowerCase()
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[đ|Đ]/g, (x) => x == "đ" ? "d" : "D")
		.replace(/\(|\)|\,/g, "")
		.replace(/ /g, "");
}

// Answer each credential-login prompt. The first attempt uses the 2FA secret
// from config; anything else is asked on the terminal.
function createOnLoginStep(spin) {
	let tryNumber = 0;
	return async function onLoginStep(step) {
		spin?._stop();
		const fields = step.fields || [];
		const answers = {};

		for (const field of fields) {
			if (field.type === "select") {
				const options = field.options || [];
				const chosen = options[0];
				log.info("LOGIN FACEBOOK", `${step.instructions || step.stepID} [${options.join(" / ")}] -> ${chosen}`);
				answers[field.id] = chosen;
				continue;
			}

			let code;
			if (field.type === "2fa" && facebookAccount["2FASecret"] && tryNumber == 0) {
				const secret = await get2FASecret(facebookAccount);
				code = isNaN(secret) ? TOTP.generate(normalizeTotpSecret(secret)).otp : secret;
			}
			else {
				log.info("LOGIN FACEBOOK", step.instructions || step.stepID);
				code = await input(`> ${field.name || field.id}: `);
				readline.moveCursor(process.stderr, 0, -1);
				readline.clearScreenDown(process.stderr);
			}
			answers[field.id] = code;
		}

		tryNumber++;
		spin?._start();
		return answers;
	};
			}
// neokex-fca warns about unknown options, so strip config-only helper keys.
function getFcaOptions() {
	const { notes, ...options } = global.GoatBot.config.optionsFca || {};
	return options;
}

async function loginWithCredentials(spin, facebookAccount) {
	const { email, password, userAgent, proxy } = facebookAccount;
	const options = {
		...getFcaOptions(),
		platform: "messenger-lite-android",
		userAgent,
		proxy,
		onLoginStep: createOnLoginStep(spin)
	};
	const api = await login({
		email: checkAndTrimString(email),
		password: checkAndTrimString(password)
	}, options);
	const appState = api.getAppState().map(item => ({
		key: item.key,
		value: item.value,
		domain: item.domain,
		path: item.path,
		hostOnly: item.hostOnly,
		creation: item.creation,
		lastAccessed: item.lastAccessed
	})).filter(item => item.key);
	return appState;
}

async function getAppStateToLogin(loginWithEmail) {
	let appState = [];
	if (loginWithEmail)
		return await getAppStateFromEmail(undefined, facebookAccount);
	if (!existsSync(dirAccount))
		return log.error("LOGIN FACEBOOK", getText('login', 'notFoundDirAccount', colors.green(dirAccount)));
	const accountText = readFileSync(dirAccount, "utf8");

	try {
		const splitAccountText = accountText.replace(/\|/g, '\n').split('\n').map(i => i.trim()).filter(i => i);

		if (accountText.match(/^(?:\s*\w+\s*=\s*[^;]*;?)+/)) {
			spin = createOraDots(getText('login', 'loginCookieString'));
			spin._start();
			appState = accountText.split(';')
				.map(i => {
					const [key, value] = i.split('=');
					return {
						key: (key || "").trim(),
						value: (value || "").trim(),
						domain: "facebook.com",
						path: "/",
						hostOnly: true,
						creation: new Date().toISOString(),
						lastAccessed: new Date().toISOString()
					};
				})
				.filter(i => i.key && i.value && i.key != "x-referer");
		}
		else if (isNetScapeCookie(accountText)) {
			spin = createOraDots(getText('login', 'loginCookieNetscape'));
			spin._start();
			appState = netScapeToCookies(accountText);
		}
		else if (
			(splitAccountText.length == 2 || splitAccountText.length == 3) &&
			!splitAccountText.slice(0, 2).map(i => i.trim()).some(i => i.includes(' '))
		) {
			global.GoatBot.config.facebookAccount.email = splitAccountText[0];
			global.GoatBot.config.facebookAccount.password = splitAccountText[1];
			if (splitAccountText[2]) {
				const code2FATemp = splitAccountText[2].replace(/ /g, "");
				global.GoatBot.config.facebookAccount['2FASecret'] = code2FATemp;
			}
			writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
		}
		else {
			try {
				spin = createOraDots(getText('login', 'loginCookieArray'));
				spin._start();
				appState = JSON.parse(accountText);
			}
			catch (err) {
				const error = new Error(`${path.basename(dirAccount)} is invalid`);
				error.name = "ACCOUNT_ERROR";
				throw error;
			}
			if (appState.some(i => i.name))
				appState = appState.map(i => {
					i.key = i.name;
					delete i.name;
					return i;
				});
			else if (!appState.some(i => i.key)) {
				const error = new Error(`${path.basename(dirAccount)} is invalid`);
				error.name = "ACCOUNT_ERROR";
				throw error;
			}
			appState = appState
				.map(item => ({
					...item,
					domain: "facebook.com",
					path: "/",
					hostOnly: false,
					creation: new Date().toISOString(),
					lastAccessed: new Date().toISOString()
				}))
				.filter(i => i.key && i.value && i.key != "x-referer");
						}
		if (await checkLiveCookie(appState.map(i => i.key + "=" + i.value).join("; "), facebookAccount.userAgent) === false) {
			const error = new Error("Cookie is invalid");
			error.name = "COOKIE_INVALID";
			throw error;
		}
	}
	catch (err) {
		spin && spin._stop();
		let { email, password } = facebookAccount;
		if (err.name === "COOKIE_INVALID")
			log.err("LOGIN FACEBOOK", getText('login', 'cookieError'));

		if (!email || !password) {
			log.warn("LOGIN FACEBOOK", getText('login', 'cannotFindAccount'));
			const rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout
			});
			const options = [
				getText('login', 'chooseAccount'),
				getText('login', 'chooseCookieString'),
				getText('login', 'chooseCookieArray')
			];
			let currentOption = 0;
			await new Promise((resolve) => {
				const character = '>';
				function showOptions() {
					rl.output.write(`\r${options.map((option, index) => index === currentOption ? colors.blueBright(`${character} (${index + 1}) ${option}`) : `  (${index + 1}) ${option}`).join('\n')}\u001B`);
					rl.write('\u001B[?25l'); // hides cursor
				}
				rl.input.on('keypress', (_, key) => {
					if (key.name === 'up') {
						currentOption = (currentOption - 1 + options.length) % options.length;
					}
					else if (key.name === 'down') {
						currentOption = (currentOption + 1) % options.length;
					}
					else if (!isNaN(key.name)) {
						const number = parseInt(key.name);
						if (number >= 0 && number <= options.length)
							currentOption = number - 1;
						process.stdout.write('\033[1D');
					}
					else if (key.name === 'enter' || key.name === 'return') {
						rl.input.removeAllListeners('keypress');
						rl.close();
						clearLines(options.length + 1);
						showOptions();
						resolve();
					}
					else {
						process.stdout.write('\033[1D');
					}

					clearLines(options.length);
					showOptions();
				});
				showOptions();
			});
			});

			rl.write('\u001B[?25h\n'); // show cursor
			clearLines(options.length + 1);
			log.info("LOGIN FACEBOOK", getText('login', 'loginWith', options[currentOption]));

			if (currentOption == 0) {
				email = await input(`${getText('login', 'inputEmail')} `);
				password = await input(`${getText('login', 'inputPassword')} `, true);
				const twoFactorAuth = await input(`${getText('login', 'input2FA')} `);
				facebookAccount.email = email || '';
				facebookAccount.password = password || '';
				facebookAccount['2FASecret'] = twoFactorAuth || '';
				writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			}
			else if (currentOption == 1) {
				const cookie = await input(getText('login', 'inputCookieString') + " ");
				writeFileSync(global.client.dirAccount, cookie);
			}
			else {
				const cookie = await input(getText('login', 'inputCookieArray') + " ");
				writeFileSync(global.client.dirAccount, JSON.stringify(JSON.parse(cookie), null, 2));
			}
			return await getAppStateToLogin();
		}

		log.info("LOGIN FACEBOOK", getText('login', 'loginPassword'));
		log.info("ACCOUNT INFO", `Email: ${facebookAccount.email}, I_User: ${facebookAccount.i_user || "(empty)"}`);
		spin = createOraDots(getText('login', 'loginPassword'));
		spin._start();

		try {
			appState = await loginWithCredentials(spin, facebookAccount);
			spin._stop();
		}
		catch (err) {
			spin._stop();
			log.err("LOGIN FACEBOOK", getText('login', 'loginError'), err.message || err, err);
			process.exit();
		}
	}
	return appState;
}
async function getAppStateFromEmail(spin = { _start: () => { }, _stop: () => { } }, facebookAccount) {
	const appState = await loginWithCredentials(spin, facebookAccount);
	return appState;
}

function stopListening(keyListen) {
	keyListen = keyListen || Object.keys(callbackListenTime).pop();
	return new Promise((resolve) => {
		global.GoatBot.fcaApi.stopListening?.(() => {
			if (callbackListenTime[keyListen]) {
				callbackListenTime[keyListen] = () => { };
			}
			resolve();
		}) || resolve();
	});
}

async function startBot(loginWithEmail) {
	console.log(colors.hex("#f5ab00")(createLine("START LOGGING IN", true)));
	const currentVersion = require("../../package.json").version;

	if (global.GoatBot.Listening)
		await stopListening();

	log.info("LOGIN FACEBOOK", getText('login', 'currentlyLogged'));

	let appState = await getAppStateToLogin(loginWithEmail);
	changeFbStateByCode = true;
	appState = filterKeysAppState(appState);
	writeFileSync(dirAccount, JSON.stringify(appState, null, 2));
	setTimeout(() => changeFbStateByCode = false, 1000);
	// ——————————————————— LOGIN ———————————————————— //
	(function loginBot(appState) {
		global.GoatBot.commands = new Map();
		global.GoatBot.eventCommands = new Map();
		global.GoatBot.aliases = new Map();
		global.GoatBot.onChat = [];
		global.GoatBot.onEvent = [];
		global.GoatBot.onReply = new Map();
		global.GoatBot.onReaction = new Map();
		clearInterval(global.intervalRestartListenMqtt);
		delete global.intervalRestartListenMqtt;

		if (facebookAccount.i_user)
			pushI_user(appState, facebookAccount.i_user);

		let isSendNotiErrorMessage = false;

		login({ appState }, getFcaOptions(), async function (error, api) {
			if (!isNaN(facebookAccount.intervalGetNewCookie) && facebookAccount.intervalGetNewCookie > 0)
				if (facebookAccount.email && facebookAccount.password) {
					spin?._stop();
					log.info("REFRESH COOKIE", getText('login', 'refreshCookieAfter', convertTime(facebookAccount.intervalGetNewCookie * 60 * 1000, true)));
					setTimeout(async function refreshCookie() {
						try {
							log.info("REFRESH COOKIE", getText('login', 'refreshCookie'));
							const appState = await getAppStateFromEmail(undefined, facebookAccount);
							if (facebookAccount.i_user)
								pushI_user(appState, facebookAccount.i_user);
							changeFbStateByCode = true;
							writeFileSync(dirAccount, JSON.stringify(filterKeysAppState(appState), null, 2));
							setTimeout(() => changeFbStateByCode = false, 1000);
							log.info("REFRESH COOKIE", getText('login', 'refreshCookieSuccess'));
							return startBot();
						}
						catch (err) {
							log.err("REFRESH COOKIE", getText('login', 'refreshCookieError'), err.message || err, err);
							setTimeout(refreshCookie, facebookAccount.intervalGetNewCookie * 60 * 1000);
						}
					}, facebookAccount.intervalGetNewCookie * 60 * 1000);
				}
				else {
					spin?._stop();
					log.warn("REFRESH COOKIE", getText('login', 'refreshCookieWarning'));
				}
			spin ? spin._stop() : null;

			// Handle error
			if (error) {
				log.err("LOGIN FACEBOOK", getText('login', 'loginError'), error);
				global.statusAccountBot = 'can\'t login';
				if (facebookAccount.email && facebookAccount.password) {
					return startBot(true);
				}
				else {
					process.exit();
				}
									}
				global.GoatBot.fcaApi = api;
			// Remember the ids of messages the bot sends so a reaction on them can be
			// recognised as targeting the bot's own message (used by unsendOnReaction).
			const sentMessageIDs = new Set();
			global.GoatBot.sentMessageIDs = sentMessageIDs;
			const rememberSent = (data) => {
				for (const item of Array.isArray(data) ? data : [data]) {
					const id = item && (item.messageID || item.message_id);
					if (!id)
						continue;
					sentMessageIDs.add(String(id));
					if (sentMessageIDs.size > 1000)
						sentMessageIDs.delete(sentMessageIDs.values().next().value);
				}
			};
			for (const name of ["sendMessage", "sendMessageMqtt"]) {
				const original = api[name];
				if (typeof original != "function")
					continue;
				api[name] = function (...params) {
					const result = original.apply(api, params);
					if (result && typeof result.then == "function")
						result.then(rememberSent).catch(() => { });
					return result;
				};
			}
			global.GoatBot.botID = api.getCurrentUserID();
			log.info("LOGIN FACEBOOK", getText('login', 'loginSuccess'));
			let hasBanned = false;
			global.botID = api.getCurrentUserID();
			logColor("#f5ab00", createLine("BOT INFO"));
			log.info("NODE VERSION", process.version);
			log.info("PROJECT VERSION", currentVersion);
			log.info("BOT ID", `${global.botID} - ${await getName(global.botID)}`);
			log.info("PREFIX", global.GoatBot.config.prefix);
			log.info("LANGUAGE", global.GoatBot.config.language);
			log.info("BOT NICK NAME", global.GoatBot.config.nickNameBot || "GOAT BOT");
			// ———————————————————— GBAN ————————————————————— //
			let dataGban = {};

			try {
				const item = await axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2-Gban/master/gban.json");
				dataGban = item.data;

				// ————————————————— CHECK BOT ————————————————— //
				const botID = api.getCurrentUserID();
				if (dataGban.hasOwnProperty(botID)) {
					if (!dataGban[botID].toDate) {
						log.err('GBAN', getText('login', 'gbanMessage', dataGban[botID].date, dataGban[botID].reason, dataGban[botID].date));
						hasBanned = true;
					}
				}
				// ———————————————— CHECK ADMIN ———————————————— //
				for (const idad of global.GoatBot.config.adminBot) {
					if (dataGban.hasOwnProperty(idad)) {
						if (!dataGban[idad].toDate) {
							log.err('GBAN', getText('login', 'gbanMessage', dataGban[idad].date, dataGban[idad].reason, dataGban[idad].date));
							hasBanned = true;
						}
					}
				}
			}
			catch (e) {
				log.warn('GBAN', getText('login', 'checkGbanError'));
			}
			// ———————————————— NOTIFICATIONS ———————————————— //
			let notification = "";
			try {
				const getNoti = await axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2-Gban/master/notification.txt");
				notification = getNoti.data;
			}
			catch (err) {
				log.warn("ERROR", "Can't get notifications data");
			}
			if (global.GoatBot.config.autoRefreshFbstate == true) {
				const persistFbstate = () => {
					changeFbStateByCode = true;
					try {
						writeFileSync(dirAccount, JSON.stringify(filterKeysAppState(api.getAppState()), null, 2));
						log.info("REFRESH FBSTATE", getText('login', 'refreshFbstateSuccess', path.basename(dirAccount)));
					}
					catch (err) {
						log.warn("REFRESH FBSTATE", getText('login', 'refreshFbstateError', path.basename(dirAccount)), err);
					}
					setTimeout(() => changeFbStateByCode = false, 1000);
				};
				persistFbstate();
				// The client rotates its session tokens in place, so persist the live
				// cookies periodically instead of only once at startup; otherwise a
				// restart after the process dies reloads an expired fbstate.
				const fbstateIntervalMs = Math.max(Number(global.GoatBot.config.autoRefreshFbstateInterval) || 30, 1) * 60 * 1000;
				const fbstateTimer = setInterval(persistFbstate, fbstateIntervalMs);
				if (fbstateTimer.unref) fbstateTimer.unref();
			}
			if (hasBanned == true) {
				log.err('GBAN', getText('login', 'youAreBanned'));
				process.exit();
			}
			// ——————————————————— LOAD DATA ——————————————————— //
			const { threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, sequelize } = await require("./loadData.js")(api, createLine);
			// ————————————————— CUSTOM SCRIPTS ————————————————— //
			await require("../custom.js")({ api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, getText });
			// —————————————————— LOAD SCRIPTS —————————————————— //
			await require("./loadScripts.js")(api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, createLine);
			// ———————————— CHECK AUTO LOAD SCRIPTS ———————————— //
			if (global.GoatBot.config.autoLoadScripts?.enable == true) {
				const ignoreCmds = global.GoatBot.config.autoLoadScripts.ignoreCmds?.replace(/[ ,]+/g, ' ').trim().split(' ') || [];
				const ignoreEvents = global.GoatBot.config.autoLoadScripts.ignoreEvents?.replace(/[ ,]+/g, ' ').trim().split(' ') || [];

				watch(`${process.cwd()}/scripts/cmds`, async (event, filename) => {
					if (filename.endsWith('.js')) {
						if (ignoreCmds.includes(filename) || filename.endsWith('.eg.js'))
							return;
						if ((event == 'change' || event == 'rename') && existsSync(`${process.cwd()}/scripts/cmds/${filename}`)) {
							try {
								const contentCommand = global.temp.contentScripts.cmds[filename] || "";
								const currentContent = readFileSync(`${process.cwd()}/scripts/cmds/${filename}`, 'utf-8');
								if (contentCommand == currentContent)
									return;
								global.temp.contentScripts.cmds[filename] = currentContent;
								filename = filename.replace('.js', '');

								const infoLoad = global.utils.loadScripts("cmds", filename, log, global.GoatBot.configCommands, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData);
								if (infoLoad.status == "success")
									log.master("AUTO LOAD SCRIPTS", `Command ${filename}.js (${infoLoad.command.config.name}) has been reloaded`);
								else
									log.err("AUTO LOAD SCRIPTS", `Error when reload command ${filename}.js`, infoLoad.error);
							}
							catch (err) {
								log.err("AUTO LOAD SCRIPTS", `Error when reload command ${filename}.js`, err);
							}
						}
					}
				});
				watch(`${process.cwd()}/scripts/events`, async (event, filename) => {
					if (filename.endsWith('.js')) {
						if (ignoreEvents.includes(filename) || filename.endsWith('.eg.js'))
							return;
						if ((event == 'change' || event == 'rename') && existsSync(`${process.cwd()}/scripts/events/${filename}`)) {
							try {
								const contentEvent = global.temp.contentScripts.events[filename] || "";
								const currentContent = readFileSync(`${process.cwd()}/scripts/events/${filename}`, 'utf-8');
								if (contentEvent == currentContent)
									return;
								global.temp.contentScripts.events[filename] = currentContent;
								filename = filename.replace('.js', '');

								const infoLoad = global.utils.loadScripts("events", filename, log, global.GoatBot.configCommands, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData);
								if (infoLoad.status == "success")
									log.master("AUTO LOAD SCRIPTS", `Event ${filename}.js (${infoLoad.command.config.name}) has been reloaded`);
								else
									log.err("AUTO LOAD SCRIPTS", `Error when reload event ${filename}.js`, infoLoad.error);
							}
							catch (err) {
								log.err("AUTO LOAD SCRIPTS", `Error when reload event ${filename}.js`, err);
							}
						}
					}
				});
			}
			// ———————————————————— ADMIN BOT ———————————————————— //
			logColor('#f5ab00', character);
			let i = 0;
			const adminBot = global.GoatBot.config.adminBot
				.filter(item => !isNaN(item))
				.map(item => item = item.toString());
			for (const uid of adminBot) {
				try {
					const userName = await usersData.getName(uid);
					log.master("ADMINBOT", `[${++i}] ${uid} | ${userName}`);
				}
				catch (e) {
					log.master("ADMINBOT", `[${++i}] ${uid}`);
				}
			}
			log.master("NOTIFICATION", (notification || "").trim());
			log.master("SUCCESS", getText('login', 'runBot'));
			log.master("LOAD TIME", `${convertTime(Date.now() - global.GoatBot.startTime)}`);
			logColor("#f5ab00", createLine("COPYRIGHT"));
			console.log(`\x1b[1m\x1b[33m${("COPYRIGHT:")}\x1b[0m\x1b[1m\x1b[37m \x1b[0m\x1b[1m\x1b[36m${("Project GoatBot v2 created by ntkhang03 (https://github.com/ntkhang03), please do not sell this source code or claim it as your own. Thank you!")}\x1b[0m`);
			logColor("#f5ab00", character);
			global.GoatBot.config.adminBot = adminBot;
			writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			writeFileSync(global.client.dirConfigCommands, JSON.stringify(global.GoatBot.configCommands, null, 2));

			// ——————————————————————————————————————————————————— //
			const { restartListenMqtt } = global.GoatBot.config;
			let intervalCheckLiveCookieAndRelogin = false;
			// —————————————————— CALLBACK LISTEN —————————————————— //
			async function callBackListen(error, event) {
				if (error) {
					global.responseUptimeCurrent = responseUptimeError;
					const errorMessage = typeof error == "string" ? error : error.error || error.message || "";
					if (
						errorMessage == "Not logged in" ||
						errorMessage == "Not logged in." ||
						errorMessage == "Connection refused: Server unavailable"
					) {
						log.err("NOT LOGGEG IN", getText('login', 'notLoggedIn'), error);
						global.responseUptimeCurrent = responseUptimeError;
						global.statusAccountBot = 'can\'t login';
						if (!isSendNotiErrorMessage) {
							await handlerWhenListenHasError({ api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, error });
							isSendNotiErrorMessage = true;
						}

						if (global.GoatBot.config.autoRestartWhenListenMqttError)
							process.exit(2);
						else {
							const keyListen = Object.keys(callbackListenTime).pop();
							if (callbackListenTime[keyListen])
								callbackListenTime[keyListen] = () => { };
							const cookieString = appState.map(i => i.key + "=" + i.value).join("; ");

							let times = 5;

							const spin = createOraDots(getText('login', 'retryCheckLiveCookie', times));
							const countTimes = setInterval(() => {
								times--;
								if (times == 0)
									times = 5;
								spin.text = getText('login', 'retryCheckLiveCookie', times);
							}, 1000);

							if (intervalCheckLiveCookieAndRelogin == false) {
								intervalCheckLiveCookieAndRelogin = true;
								const interval = setInterval(async () => {
									const cookieIsLive = await checkLiveCookie(cookieString, facebookAccount.userAgent);
									if (cookieIsLive !== false) {
										clearInterval(interval);
										clearInterval(countTimes);
										intervalCheckLiveCookieAndRelogin = false;
										const keyListen = Date.now();
										isSendNotiErrorMessage = false;
										global.GoatBot.Listening = api.listenMqtt(createCallBackListen(keyListen));
									}
								}, 5000);
							}
						}
						return;
					}
					else if (error == "Connection closed." || error == "Connection closed by user.") /* by stopListening; */ {
						return;
					}
					else {
						await handlerWhenListenHasError({ api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, error });
						return log.err("LISTEN_MQTT", getText('login', 'callBackError'), error);
					}
				}
				global.responseUptimeCurrent = responseUptimeSuccess;
				global.statusAccountBot = 'good';
				const configLog = global.GoatBot.config.logEvents;
				if (isSendNotiErrorMessage == true)
					isSendNotiErrorMessage = false;

				if (
					global.GoatBot.config.whiteListMode?.enable == true
					&& global.GoatBot.config.whiteListModeThread?.enable == true
					&& !global.GoatBot.config.adminBot.includes(event.senderID)
				) {
					if (
						!global.GoatBot.config.whiteListMode.whiteListIds.includes(event.senderID)
						&& !global.GoatBot.config.whiteListModeThread.whiteListThreadIds.includes(event.threadID)
						&& !global.GoatBot.config.adminBot.includes(event.senderID)
					)
						return;
				}
				else if (
					global.GoatBot.config.whiteListMode?.enable == true
					&& !global.GoatBot.config.whiteListMode.whiteListIds.includes(event.senderID)
					&& !global.GoatBot.config.adminBot.includes(event.senderID)
				)
					return;
				else if (
					global.GoatBot.config.whiteListModeThread?.enable == true
					&& !global.GoatBot.config.whiteListModeThread.whiteListThreadIds.includes(event.threadID)
					&& !global.GoatBot.config.adminBot.includes(event.senderID)
				)
					return;

				// check if listenMqtt loop
				if (event.messageID && event.type == "message") {
					if (storage5Message.includes(event.messageID))
						Object.keys(callbackListenTime).slice(0, -1).forEach(key => {
							callbackListenTime[key] = () => { };
						});
					else
						storage5Message.push(event.messageID);
					if (storage5Message.length > 5)
						storage5Message.shift();
				}

				if (configLog.disableAll === false && configLog[event.type] !== false) {
					const participantIDs_ = [...event.participantIDs || []];
					if (event.participantIDs)
						event.participantIDs = 'Array(' + event.participantIDs.length + ')';

					console.log(colors.green((event.type || "").toUpperCase() + ":"), jsonStringifyColor(event, null, 2));

					if (event.participantIDs)
						event.participantIDs = participantIDs_;
				}

				if ((event.senderID && dataGban[event.senderID] || event.userID && dataGban[event.userID])) {
					if (event.body && event.threadID) {
						const prefix = getPrefix(event.threadID);
						if (event.body.startsWith(prefix))
							return api.sendMessage(getText('login', 'userBanned'), event.threadID);
						return;
					}
					else
						return;
				}

				const handlerAction = require("../handler/handlerAction.js")(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

				if (hasBanned === false)
					handlerAction(event);
				else
					return log.err('GBAN', getText('login', 'youAreBanned'));
			}
			// ————————————————— CREATE CALLBACK ————————————————— //
			function createCallBackListen(key) {
				key = randomString(10) + (key || Date.now());
				callbackListenTime[key] = callBackListen;
				return function (error, event) {
					callbackListenTime[key](error, event);
				};
			}
			// ———————————————————— START BOT ———————————————————— //
			await stopListening();
			global.GoatBot.Listening = api.listenMqtt(createCallBackListen());
			global.GoatBot.callBackListen = callBackListen;
			// ——————————————————— UPTIME ——————————————————— //
			startUptimeServer();
			// ———————————————————— RESTART LISTEN ———————————————————— //
			if (restartListenMqtt.enable == true) {
				if (restartListenMqtt.logNoti == true) {
					log.info("LISTEN_MQTT", getText('login', 'restartListenMessage', convertTime(restartListenMqtt.timeRestart, true)));
					log.info("BOT_STARTED", getText('login', 'startBotSuccess'));

					logColor("#f5ab00", character);
				}
				const restart = setInterval(async function () {
					if (restartListenMqtt.enable == false) {
						clearInterval(restart);
						return log.warn("LISTEN_MQTT", getText('login', 'stopRestartListenMessage'));
					}
					try {
						await stopListening();
						await sleep(restartListenMqtt.delayAfterStopListening || 0);
						global.GoatBot.Listening = api.listenMqtt(createCallBackListen());
						log.info("LISTEN_MQTT", getText('login', 'restartListenMessage2'));
					}
					catch (e) {
						log.err("LISTEN_MQTT", getText('login', 'restartListenMessageError'), e);
					}
				}, restartListenMqtt.timeRestart);
				global.intervalRestartListenMqtt = restart;
			}
			require('../autoUptime.js');
		});
	})(appState);

	if (global.GoatBot.config.autoReloginWhenChangeAccount) {
		setTimeout(function () {
			watch(dirAccount, async (type) => {
				if (type == 'change' && changeFbStateByCode == false && latestChangeContentAccount != fs.statSync(dirAccount).mtimeMs) {
					clearInterval(global.intervalRestartListenMqtt);
					global.compulsoryStopLisening = true;
					latestChangeContentAccount = fs.statSync(dirAccount).mtimeMs;
					startBot();
				}
			});
		}, 10000);
	}
}
// Minimal web service: a JSON status endpoint only, used by uptime pingers.
function startUptimeServer() {
	if (global.GoatBot.config.serverUptime?.enable != true || uptimeServerRunning)
		return;
	uptimeServerRunning = true;
	const http = require('http');
	const PORT = process.env.PORT || global.GoatBot.config.serverUptime.port || global.GoatBot.config.dashBoard?.port || 3001;
	const server = http.createServer((req, res) => {
		const url = (req.url || "/").split("?")[0];
		if (url === "/" || url === "/uptime")
			return global.responseUptimeCurrent(req, res);
		sendJson(res, 404, { status: "error", message: "Not found" });
	});
	let nameUpTime;
	try {
		nameUpTime = `https://${process.env.REPL_OWNER ?
			`${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` :
			process.env.API_SERVER_EXTERNAL == "https://api.glitch.com" ?
				`${process.env.PROJECT_DOMAIN}.glitch.me` :
				`localhost:${PORT}`}`;
		nameUpTime.includes('localhost') && (nameUpTime = nameUpTime.replace('https', 'http'));
		server.listen(PORT, "0.0.0.0");
		log.info("UPTIME", getText('login', 'openServerUptimeSuccess', nameUpTime));
		if (global.GoatBot.config.serverUptime.socket?.enable == true)
			require('./socketIO.js')(server);
	}
	catch (err) {
		log.err("UPTIME", getText('login', 'openServerUptimeError'), err);
	}
}

global.GoatBot.reLoginBot = startBot;
startUptimeServer();
startBot();
