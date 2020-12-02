const scripts = [{
    type: 'raw',
    name: 'interest-map',
    raw: 'https://raw.githubusercontent.com/bring-larry-to-life/scriptable-widget-interest-map/main/widget.js',
    forceDownload: false,
    storedParameters: { "apiKey": "testtest" }
}, {
    type: 'raw',
    name: 'busyness-calendar',
    raw: 'https://raw.githubusercontent.com/stanleyrya/scriptable-widget-busyness-calendar/main/widget.js',
    forceDownload: false,
    storedParameters: { "monthDiff": 0 }
}, {
    type: 'raw',
    name: 'append-to-performance-metrics',
    raw: 'https://raw.githubusercontent.com/stanleyrya/scriptable-playground/main/append-to-performance-metrics.js',
    forceDownload: false
}, {
    type: 'raw',
    name: 'read-write-stored-parameters',
    raw: 'https://raw.githubusercontent.com/stanleyrya/scriptable-playground/main/read-write-stored-parameters.js',
    forceDownload: false
}, {
    type: 'raw',
    name: 'reverse-geocode-tests',
    raw: 'https://raw.githubusercontent.com/stanleyrya/scriptable-playground/main/reverse-geocode-tests.js',
    forceDownload: false
}]

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
        writeStoredParameters(script.name, script.storedParameters)
    }

    return await download(script);
}

/**
 * Attempts to write parameters to the file ./storage/name.json
 */
function writeStoredParameters(name, params) {
    const fm = getFileManager();
    const storageDir = getCurrentDir() + "storage";
    const parameterPath = storageDir + "/" + name + ".json";

    if (!fm.fileExists(storageDir)) {
        console.log("Storage folder does not exist! Creating now.");
        fm.createDirectory(storageDir);
    } else if (!fm.isDirectory(storageDir)) {
        throw ("Storage folder exists but is not a directory!");
    }

    if (fm.fileExists(parameterPath) && fm.isDirectory(parameterPath)) {
        throw ("Parameter file is a directory, please delete!");
    }

    fm.writeString(parameterPath, JSON.stringify(params));
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
