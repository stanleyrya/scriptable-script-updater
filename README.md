# scriptable-universal-widget

### Original Inspiration:
https://gitlab.com/sillium-scriptable-projects/universal-scriptable-widget/-/tree/master

### How it works

#### Setup

1. Copy the widget code into your Scriptable app.
2. Configure the library to be used. You can use some of the examples below.
    * Name: The local file and folder name of the library.
    * Raw: The direct link to the library code.
    * Force Download: Whether or not the code should be downloaded each time if it already exists. Set to true while working on the project.
3. If the library requires parameters you can add them to the `debugParams` object or the widget settings on your homescreen.
4. Make sure the name of your script tells you what library you are using so it's easy to remember which one it is! While this script could be parameterized to load any module, right now it needs to be copied every time you want another type of widget.
5. Run it!

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
