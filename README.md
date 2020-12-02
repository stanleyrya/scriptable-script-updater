# scriptable-script-updater

Tired of editing scripts on your phone? Then this helper script was made for you!

This script acts as a file downloader for your scriptable app. If turned on, it will download the contents of a URL to a local file. If used with Github or Gitlab's raw feature, it can automatically pull the most recent commit of a branch!

This script also has parameter writing capabilities. It can write a JSON object to a file that can be read by your script. It's an easy way to quickly edit input and test your script.

### Original Inspiration:
https://gitlab.com/sillium-scriptable-projects/universal-scriptable-widget/-/tree/master

### Setup

1. Copy the script code into your Scriptable app.
2. Configure the scripts to be used. You can use some of the examples below.
    * type: The type of the script object. Currently only `raw` is supported but there are plans to support Github directly for releases, commits, easy rollback, and more!
    * name: The local file name of the script.
    * raw: The direct link to the script's code. You can usually find this by clicking "raw" on the code's webpage (Github, etc.).
    * forceDownload: Whether or not the code should be downloaded each time if it already exists. Set to true while working on the project.
    * [Optional] storedParameters: A JSON object that will be stored in a file for easy access from the downloaded script. Stored here: `./storage/<name>.json`.
3. Run it!

### Converting a Widget to use "Stored Parameters"

If you'd like to use the "Stored Parameters" feature all you have to do is add [these functions](https://github.com/stanleyrya/scriptable-playground/blob/2b9cf55c6df1d89d043b50f4b29d86c368942784/read-write-stored-parameters.js#L3-L50) to your script and [add logic to read it](https://github.com/bring-larry-to-life/scriptable-widget-interest-map/blob/7a72c224305fb16eb96438e8044d6bd7f5497eed/widget.js#L445-L459). I recommend supporting multiple input types in case you'd like to share your script and the people downloading it are new to scripting.

### My code isn't updating!

If you are using Github it's worth noting that Github caches their raw CDN for 5 minutes. There seems to be ways around this (other CDNs, calling their API for a commit hash then loading that hash directly, etc.) but this script doesn't use those yet.

### Example Scripts

#### [Interest Map](https://github.com/bring-larry-to-life/scriptable-widget-interest-map)

This is a widget that displays a Google map of interesting things in the area. On click, it lists the interesting things and allows the user to click them for additional details.

The `apiKey` in the parameters is a Google Maps API key. Make sure not to post it anywhere if you create one!

```
{
    type: 'raw',
    name: 'interest-map',
    raw: 'https://raw.githubusercontent.com/bring-larry-to-life/scriptable-widget-interest-map/main/widget.js',
    forceDownload: false,
    storedParameters: {"apiKey": "testtest"}
}
```

#### [Busy-ness Calendar](https://github.com/stanleyrya/scriptable-widget-busyness-calendar)

This is a widget that displays how busy the user is using the default calendar on iOS. Each week shows a percentage of busy days. Currently a WIP.

The `monthDiff` parameter changes the widget to point to another month. For example `1` goes forward and `-1` goes back. This parameter is useful in the widget settings on the homescreen so you can display multiple different months with the same code (or even stack them!).

```
{
    type: 'raw',
    name: 'busyness-calendar',
    raw: 'https://raw.githubusercontent.com/stanleyrya/scriptable-widget-busyness-calendar/main/widget.js',
    forceDownload: false,
    storedParameters: {"monthDiff": 0}
}
```
