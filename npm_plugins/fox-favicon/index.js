const fs = require('fs');
const favicons = require('favicons');

class FoxFavicon {
	constructor(options) {
		this.options = this.getConfig(options);

		if (!this.options.devMode)
			this.createFavicons();
	}


	getConfig(options) {
		return Object.assign({
			src: false,				 // адрес к иконки из которой будут сгенерирован набор.
			path: '',             // адрес где генерировать иконки
			urlIcon: '',      	 // адрес к каталогу иконок на хостингеe
			pathManifest: '/',		 // адрес по которому браузер будет искать файлы манифеста. (по умолчанию корень)
			devMode: false,       // режим сборки
			appName: 'null',                            // Your application's name. `string`
			appShortName: 'null',                       // Your application's short_name. `string`. Optional. If not set, appName will be used
			appDescription: 'null',                     // Your application's description. `string`
			developerName: 'null',                      // Your (or your developer's) name. `string`
			developerURL: 'null',                       // Your (or your developer's) URL. `string`
			dir: "auto",                              // Primary text direction for name, short_name, and description
			lang: "en-US",                            // Primary language for name and short_name
			background: "#fff",                       // Background colour for flattened icons. `string`
			// eslint-disable-next-line camelcase
			theme_color: "#fff",                      // Theme color user for example in Android's task switcher. `string`
			appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
			display: "standalone",                    // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
			orientation: "any",                       // Default orientation: "any", "natural", "portrait" or "landscape". `string`
			//scope: '',                               // set of URLs that the browser considers within your app
			// eslint-disable-next-line camelcase
			start_url: "/?homescreen=1",              // Start URL when launching the application from a device. `string`
			version: "1.0",                           // Your application's version string. `string`
			logging: false,                           // Print logs to console? `boolean`
			// eslint-disable-next-line camelcase
			pixel_art: false,                         // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
			loadManifestWithCredentials: false,       // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
			icons: {
				android: true,              // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
				appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
				appleStartup: true,         // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
				coast: true,                // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
				favicons: true,             // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
				firefox: true,              // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
				windows: true,              // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
				yandex: true                // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
			}
		}, options);
	}


	createFavicons() {
		let callback = (error, response) => {
			if (error) {
				console.log(error.message);
				return;
			}
			this.html = response.html;
			this.files = response.files;
			this.images = response.images;
		};

		favicons(this.options.src, this.options, callback);
	}

	setHeadLink(callback) {

		const urlManifest = this.options.pathManifest + 'manifest.json';
		const urlBrowserconfig =
			this.options.pathManifest + 'browserconfig.xml';

		const urlYandexBrowser =
			this.options.pathManifest + 'yandex-browser-manifest.json';

		const manifest =
			'<link rel="manifest" href="' +
			urlManifest + '">';

		const browserconfig =
			'<meta name="msapplication-config" content="' +
			urlBrowserconfig + '">';

		const yandexBrowser =
			'<link rel="yandex-tableau-widget" href="' +
			urlYandexBrowser + '">';

		const masTeg = [manifest, browserconfig, yandexBrowser];

		const nameSearch = [
			'rel="manifest"',
			'name="msapplication-config"',
			'rel="yandex-tableau-widget"'
		];

		let mas = [];

		for (let str of this.html) {
			if (str) {
				let masAttr = str.split(' ');
				let teg = '';
				for (let attr of masAttr) {
					const index = nameSearch.indexOf(attr, 0); // получаем индекс совпавшего элемента

					if (index != -1) {
						teg = masTeg[index];
						break;
					}
				}

				teg ? mas.push(teg) : mas.push(str);
			}
		}

		callback(mas);
	}


	setHtmlLink(compiler) {
		this.buildFiles((assets) => {
			Object.keys(assets).map((i) => {
				if (i.indexOf('.html') !== -1) { //------------------- получаем только html файлы
					let HTML = assets[i]._value.toString(); //--------- получаем html код

					this.setHeadLink((strLink) => {
						assets[i]._value = HTML.replace(
							/<head>([\s\S]*?)<\/head>/,
							`<head>$1\r${strLink.join('\r')}</head>`
						);
					});
				}
			});
		}, compiler, true);
	}

	createFiles(compiler) {
		this.buildFiles((assets) => {

			// Добавляет сгенерированные изображения для сборки 
			if (this.images) {
				Object.keys(this.images).map((i) => {
					let image = this.images[i];
					assets[`${this.options.path}${image.name}`] = {
						source: () => image.contents,
						size: () => image.contents.length
					};
				});
			}

			// Добавляет файлы манифеста json и xml для сборки 
			if (this.files) {
				let reg = new RegExp(this.options.path, 'g');
				Object.keys(this.files).map((i) => {
					let file = this.files[i];
					let temp = file.contents.replace(
						reg, this.options.urlIcon
					);
					assets[`${this.options.pathManifest}${file.name}`] = {
						source: () => temp,
						size: () => file.contents.length
					};
				});
			}
		}, compiler);
	}


	buildFiles(callback, compiler, fl = false) {
		compiler.hooks.thisCompilation.tap(
			{ name: 'FoxFavicon' },
			(compilation) => {
				let process = compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS;
				let additional = compilation.PROCESS_ASSETS_STAGE_ADDITIONAL;
				compilation.hooks.processAssets.tap(
					{
						name: 'FoxFavicon',
						stage: fl ? process : additional,
						additionalAssets: fl
					},
					callback
				);
			});
	}


	apply(compiler) {

		if (this.options.devMode) return;

		let { output } = compiler.options;


		if (!fs.existsSync(output.path)) { // проверяем есть ли адрес до папки dist
			fs.mkdirSync(output.path); // если нет то создаём
		}

		if (this.options.src && output.path) {
			this.setHtmlLink(compiler); // вставка HTML ссылок
			this.createFiles(compiler); // создаём иконки и Manifest
		}
	}
}

module.exports = FoxFavicon;