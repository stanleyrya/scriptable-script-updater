// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: cloud-download-alt;
const scripts = [{
    type: 'raw',
    name: 'interest-map',
    raw: 'https://raw.githubusercontent.com/bring-larry-to-life/scriptable-widget-interest-map/main/widget.js',
    forceDownload: false,
    storedParameters: { "apiKey": "XXX", "forceWidgetView": false, "writeLogsIfException": true, "logPerformanceMetrics": true }
}, {
    type: 'raw',
    name: 'busyness-calendar',
    raw: 'https://raw.githubusercontent.com/stanleyrya/scriptable-widget-busyness-calendar/main/widget.js',
    forceDownload: false,
    storedParameters: { "monthDiff": 0 }
}, {
    type: 'raw',
    name: 'performance-debugger',
    raw: 'https://raw.githubusercontent.com/stanleyrya/scriptable-playground/main/performance-debugger/performance-debugger.js',
    forceDownload: false
}, {
    type: 'raw',
    name: 'json-file-manager',
    raw: 'https://raw.githubusercontent.com/stanleyrya/scriptable-playground/main/json-file-manager/json-file-manager.js',
    forceDownload: false
}, {
    type: 'raw',
    name: 'reverse-geocode-tests',
    raw: 'https://raw.githubusercontent.com/stanleyrya/scriptable-playground/main/reverse-geocode-tests.js',
    forceDownload: false
}, {
    type: 'raw',
    name: 'file-logger',
    raw: 'https://raw.githubusercontent.com/stanleyrya/scriptable-playground/main/file-logger/file-logger.js',
    forceDownload: false
}]

/**
 * Class that can read and write JSON objects using the file system.
 *
 * This is a minified version but it can be replaced with the full version by copy pasting this code!
 * https://github.com/stanleyrya/scriptable-playground/blob/main/json-file-manager/json-file-manager.js
 *
 * Usage:
 *  * write(relativePath, jsonObject): Writes JSON object to a relative path.
 *  * read(relativePath): Reads JSON object from a relative path.
 */
class JSONFileManager{write(e,r){const t=this.getFileManager(),i=this.getCurrentDir()+e,l=e.split("/");if(l>1){const e=l[l.length-1],r=i.replace("/"+e,"");t.createDirectory(r,!0)}if(t.fileExists(i)&&t.isDirectory(i))throw"JSON file is a directory, please delete!";t.writeString(i,JSON.stringify(r))}read(e){const r=this.getFileManager(),t=this.getCurrentDir()+e;if(!r.fileExists(t))throw"JSON file does not exist! Could not load: "+t;if(r.isDirectory(t))throw"JSON file is a directory! Could not load: "+t;r.downloadFileFromiCloud(t);const i=JSON.parse(r.readString(t));if(null!==i)return i;throw"Could not read file as JSON! Could not load: "+t}getFileManager(){try{return FileManager.iCloud()}catch(e){return FileManager.local()}}getCurrentDir(){const e=this.getFileManager(),r=module.filename;return r.replace(e.fileName(r,!0),"")}}
const jsonFileManager = new JSONFileManager();

async function update() {
    let results = {
        "updated": 0,
        "failed": 0,
        "off": 0
    };

    for (const script of scripts) {
        try {
            if (await processScript(script)) {
                results.updated++;
            } else {
                results.off++;
            }
        } catch (err) {
            console.error(err);
            results.failed++
        }
    }

    return results;
}

async function processScript(script) {
    if (script.storedParameters) {
        jsonFileManager.write("storage/" + script.name + ".json", script.storedParameters)
    }

    return await download(script);
}

/**
 * Downloads script using different logic depending on the type. Returns true if updated, false if turned off.
 *
 * @param {{type: string, name: string, raw: string, forceDownload: bool}} script
 */
async function download(script) {
    switch (script.type) {
    case 'raw':
        return await downloadScript(script);
    default:
        throw ("Can't interpret type. Not downloading file.");
    }
}

/**
 * Downloads script file if forced or not yet existing. Returns true if updated, false if turned off.
 *
 * @param {{name: string, raw: string, forceDownload: bool}} script
 */
async function downloadScript(script) {
    const fm = getFileManager();
    const path = fm.joinPath(getCurrentDir(), script.name + '.js');
    const forceDownload = (script.forceDownload) ? script.forceDownload : false;

    if (fm.fileExists(path) && !forceDownload) {
        console.log("Not downloading script " + script.name);
        return false;
    } else {
        console.log("Downloading script '" + script.raw + "' to '" + path + "'")
        const req = new Request(script.raw)
        let scriptFile = await req.load()
        fm.write(path, scriptFile)
    }

    return true;
}

function getFileManager() {
    try {
        return FileManager.iCloud();
    } catch (e) {
        return FileManager.local();
    }
}

function getCurrentDir() {
    const fm = getFileManager();
    const thisScriptPath = module.filename;
    return thisScriptPath.replace(fm.fileName(thisScriptPath, true), '');
}

/**
 * Displays the results of the updater script in widget format.
 *
 * @param {{ "updated": 3, "failed": 4, "off": 1 }} results
 */
async function createWidget(results) {
    let widget = new ListWidget();

    let startColor = new Color("#1c1c1c00");
    let endColor = new Color("#1c1c1cb4");
    let gradient = new LinearGradient();
    gradient.colors = [startColor, endColor];
    gradient.locations = [0.25, 1];
    widget.backgroundGradient = gradient;
    widget.backgroundColor = new Color("#301934");

    let titleStack = widget.addStack();
    titleStack.layoutHorizontally();

    let titleText = titleStack.addText("Script Updater");
    titleText.textColor = Color.white();
    titleText.leftAlignText();

    titleStack.addSpacer();

    let iconText = titleStack.addText("📲");
    iconText.font = Font.largeTitle();
    iconText.leftAlignText();

    widget.addSpacer();

    if (results.updated) {
        writeLine(widget, "✅ " + results.updated + " updated");
    }
    if (results.failed) {
        writeLine(widget, "⚠️ " + results.failed + " failed");
    }
    if (results.off) {
        writeLine(widget, "⏸ " + results.off + " off");
    }

    widget.addSpacer();

    let lastUpdatedDate = widget.addDate(new Date());
    lastUpdatedDate.applyTimeStyle();
    lastUpdatedDate.font = Font.thinMonospacedSystemFont(10);
    lastUpdatedDate.textColor = Color.white();
    lastUpdatedDate.rightAlignText();

    // If nothing is being updated, set refresh interval to 1 day because it isn't useful.
    if (!results.updated && !results.failed) {
        const hours = 24;
        const interval = 1000 * 60 * 60 * hours;
        widget.refreshAfterDate = new Date(Date.now() + interval);
    }

    return widget;
}

function writeLine(widget, text) {
    let textObject = widget.addText(text);
    textObject.font = Font.thinMonospacedSystemFont(12);
    textObject.textColor = Color.white();
    textObject.leftAlignText();
}

async function run(params) {
    const results = await update();
    if (config.runsInWidget) {
        const widget = await createWidget(results)
        Script.setWidget(widget)
        Script.complete()

    } else {
        // Useful for loading widget and seeing logs manually
        const widget = await createWidget(results)
        await widget.presentSmall()
    }
}

await run();
