# ** Note: This is outdated! New vision can be used [here](https://github.com/stanleyrya/scriptable-widget-updater)! **

# scriptable-universal-widget

### Description

Tired of editing widgets on your phone? Then this widget script was made for you!

This script acts as a proxy to another widget hosted somewhere online. It calls a configured endpoint to download the widget's code then simply invokes it by loading it as a module. This means that you can write code using your computer, push it to a code hosting service, then see the results on your phone! Currently tested with Github and Gitlab.

### Original Inspiration:
https://gitlab.com/sillium-scriptable-projects/universal-scriptable-widget/-/tree/master

### Setup

1. Copy the widget code into your Scriptable app.
2. Configure the library to be used. You can use some of the examples below.
    * Name: The local file and folder name of the library.
    * Raw: The direct link to the library code.
    * Force Download: Whether or not the code should be downloaded each time if it already exists. Set to true while working on the project.
3. If the library requires parameters you can add them to the `debugParams` object or the widget settings on your homescreen.
4. Make sure the name of your script tells you what library you are using so it's easy to remember which one it is! While this script could be parameterized to load any module, right now it needs to be copied every time you want another type of widget.
5. Run it!

### Converting a Widget to work with this Script

#### 1. Create async code and module code

Converting a widget to work with this script is relatively easy. The widget will have two entry points: 1. the widget getting run itself (from the homescreen, etc.) and 2. from the proxy script using `importModule`. This causes some issues when the script uses the "await" keyword at the top level. It's not possible to use the method `importModule` on a script that uses top-level-await and that's the only way to invoke the code without making additional changes (supporting query params, etc.).

To get around this limitation we can use the following pattern. We build two async functions that get run automatically, one for the script and one for the proxy script (that gets exported as a module). To prevent them both from running when being imported we can use the script's name to check where the code is running before doing anything.

While it looks complicated it's not that bad. Just move the logic that builds the widget to a "run" method and copy-paste this code to the bottom of the file. Make sure to change the script name from `ENTER-SCRIPT-NAME-HERE` to the name of the script.

```
// Runs when the script itself is invoked
(async function() {
	if (Script.name() === 'ENTER-SCRIPT-NAME-HERE') {
		let params;
		if (args.widgetParameter) {
			params = JSON.parse(args.widgetParameter);
		}

		if (params) {
			console.log("Using params: " + JSON.stringify(params))
			await run(params);
		} else {
			console.log("No valid parameters!")
		}
	}
}()).catch((err) => {
	console.error(err);
});

// Runs when a proxy script is invoked
module.exports = function(params) {
	(async function() {
		if (Script.name() !== 'ENTER-SCRIPT-NAME-HERE') {
			await run(params);
		}
	}()).catch((err) => {
		console.error(err);
	});
}
```

#### 2. [Optional] Parameterize any code that is hard-coded to the widget

Now that the widget is going to be run from the proxy you may want to replace some hard-coded constants with parameters. This is really only necessary when you want to:
1. Reuse the widget code to create multiple widgets on your home screen.
2. Use a sensitive constant like an API key.

Here's an example:  
https://github.com/bring-larry-to-life/scriptable-widget-interest-map/commit/3eca517c5724ab6ff299f3e1385554d9012734de#diff-4f17b275f05478d235d65f5f33b51bf1d6873c8e60ef9fa399006bc4a8f70d2d

### Example Modules

#### [Interest Map](https://github.com/bring-larry-to-life/scriptable-widget-interest-map)

This is a widget that displays a Google map of interesting things in the area. On click, it lists the interesting things and allows the user to click them for additional details.

The `apiKey` in the parameters is a Google Maps API key. Make sure not to post it anywhere if you create one!

```
Library info:
const libraryInfo = {
    name: 'interest-map',
    raw: 'https://raw.githubusercontent.com/bring-larry-to-life/scriptable-widget-interest-map/main/widget.js',
    forceDownload: false
}

Widget params:
{"apiKey": "XXX"}
```

#### [Busy-ness Calendar](https://github.com/stanleyrya/scriptable-widget-busyness-calendar)

This is a widget that displays how busy the user is using the default calendar on iOS. Each week shows a percentage of busy days. Currently a WIP.

The `monthDiff` parameter changes the widget to point to another month. For example `1` goes forward and `-1` goes back. This parameter is useful in the widget settings on the homescreen so you can display multiple different months with the same code (or even stack them!).

```
Library info:
const libraryInfo = {
    name: 'busyness-calendar',
    raw: 'https://raw.githubusercontent.com/stanleyrya/scriptable-widget-busyness-calendar/main/widget.js',
    forceDownload: false
}

Widget params:
{"monthDiff": 1}
```

### Why not make this script/widget dynamic?

While it's pretty easy to edit this script to take in the widget URL as a parameter I personally think it would be annoying. Here's my reasoning:
1. If your homescreen gets messed up it's pretty annoying to copy-paste all of the github URLs again.
2. If you are using parameters for your widget it's annoying to configure with the github URLs (the text box is pretty small).

If you'd like to parameterize it though, feel free! :)

### Debugging

* You can either add your parameters to the `debugParams` section in code or put them into the widget settings on your homescreen. I personally prefer just using the code itself since it's easier to edit.
* If the module doesn't load then check the Javascript code in the module for syntax errors.

#### My code isn't updating!

If you are using Github it's worth noting that Github caches their raw CDN for 5 minutes. There seems to be ways around this (other CDNs, calling their API for a commit hash then loading that hash directly, etc.) but this widget doesn't use those yet.
