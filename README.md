# scriptable-universal-widget

Tired of editing widgets on your phone? Then this widget script was made for you!

This script acts as a proxy to a widget "library" hosted somewhere online. It calls a configured endpoint to download the widget's code then simply invokes it. This means that you can write code using your computer, push it to a code hosting service, then see the results on your phone! Currently tested with Github and Gitlab.

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

### Converting a Widget into a Widget Module

#### 1. Create expected methods

Converting a widget into a widget module is relatively easy. The proxy code expects the widget to have the following methods defined:
* [CreateWidget(params)](https://github.com/bring-larry-to-life/scriptable-widget-interest-map/blob/0957cdc95279d106212b46a60bcf8860d52c3be6/widget.js#L73-L107): Given optional parameters, create and return a widget object.
* [ClickWidget(params)](https://github.com/bring-larry-to-life/scriptable-widget-interest-map/blob/0957cdc95279d106212b46a60bcf8860d52c3be6/widget.js#L65-L71): Given optional parameters, run any code you would like when the widget is clicked.

In my expereince `CreateWidget(params)` usually already exists. `ClickWidget(params)` can be added like this:
```
async function clickWidget(params) {
	console.log("Click!");
}
```

#### 2. Comment out or remove any code that runs automatically

When a widget is invoked there must be some code that calls `CreateWidget(params)` and displays it. This code has already been moved to this proxy widget and running it from the library widget causes it to fail. Usually it's only a few lines and can be commented out pretty easily. While I don't like commented out code in general, this is good to comment out in case you want to edit your script locally again without the proxy in the future.

Here are two examples of commenting out code that runs automatically:  
* https://github.com/bring-larry-to-life/scriptable-widget-interest-map/blob/4c789f5d2ef1e737c89de5c68816416db2f1c5f1/widget.js#L55-L62
* https://github.com/stanleyrya/scriptable-widget-busyness-calendar/blob/c0be17e8812ddd7f15da18cf29e978f695f1bede/widget.js#L40-L56

#### 3. [Optional] Parameterize any code that is hard-coded to the widget

Now that the library widget is going to be run from the proxy widget you may want to replace some hard-coded constants in the library widget with parameters to `CreateWidget(params)` and `ClickWidget(params)`. This is really only necessary when you want to:
1. Reuse the widget code to create multiple widgets on your home screen.
2. Use a sensitive constant like an API key.

Here's an example:  
https://github.com/bring-larry-to-life/scriptable-widget-interest-map/commit/3eca517c5724ab6ff299f3e1385554d9012734de#diff-4f17b275f05478d235d65f5f33b51bf1d6873c8e60ef9fa399006bc4a8f70d2d


#### 4. Export the functions at the bottom of your library widget

This is the easiest step. [Just add the following to the bottom of your widget:](https://github.com/bring-larry-to-life/scriptable-widget-interest-map/blob/0957cdc95279d106212b46a60bcf8860d52c3be6/widget.js#L196-L199)
```
module.exports = {
	createWidget,
	clickWidget
}
```

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

* By default this widget will call `clickWidget()` whenever it's invoked outside of a widget. If you set the `DEBUG` variable to true it will instead build and present the widget in a medium size. This is useful for debugging why the widget won't load.
* You can either add your parameters to the `debugParams` section in code or put them into the widget settings on your homescreen. I personally prefer just using the code itself since it's easier to edit.
* If the module doesn't load then check the Javascript code in the module for syntax errors.

#### My code isn't updating!

If you are using Github it's worth noting that Github caches their raw CDN for 5 minutes. There seems to be ways around this (other CDNs, calling their API for a commit hash then loading that hash directly, etc.) but this widget doesn't use those yet.
