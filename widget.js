const DEBUG = false
// Example widget params:
// {"apiKey": "XXX"}
const debugParams = {apiKey: 'XXX', debugParams: true}

const log = console.log.bind(console)

const libraryInfo = {
    name: 'interest-map',
    raw: 'https://raw.githubusercontent.com/bring-larry-to-life/scriptable-widget-interest-map/main/widget.js',
    forceDownload: true
}

let library = importModule(await downloadLibrary(libraryInfo))

let params;
if (DEBUG) {
    log("Debug flag found. Using debug parameters")
    params = debugParams;
} else if (args.widgetParameter) {
    log("Widget parameters found. Using widget parameters")
    params = JSON.parse(args.widgetParameter);
} else {
    log("No widget parameters found. Using debug parameters")
    params = debugParams;
}
log("params: " + JSON.stringify(params));

if (config.runsInWidget) {
    const widget = await library.createWidget(params)
    Script.setWidget(widget)
    Script.complete()
} else if (DEBUG) {
    const widget = await library.createWidget(params)
    await widget.presentMedium()
} else {
    await library.clickWidget(params)
}


/**
 * - creates directory for library if not existing
 * - downloads library file if forced or not yet existing
 * - returns relative path to library module
 * @param {{name: string, version: string, gitlabProject: string, forceDownload: bool}} library 
 */
async function downloadLibrary(library) {
    let fm = FileManager.local()

    let scriptPath = module.filename
    let libraryDir = scriptPath.replace(fm.fileName(scriptPath, true), fm.fileName(scriptPath, false))
    log("scriptPath: " + scriptPath)
    log("libraryDir: " + libraryDir)

    if (fm.fileExists(libraryDir) && !fm.isDirectory(libraryDir)) {
        log("library exists but is not a directory!")
        fm.remove(libraryDir)
    }
    if (!fm.fileExists(libraryDir)) {
        log("library does not exist!")
        fm.createDirectory(libraryDir)
    }
    
    let libraryFilename = library.name + '.js'
    let path = fm.joinPath(libraryDir, libraryFilename)
    let forceDownload = (library.forceDownload) ? library.forceDownload : false
    log("libraryFilename: " + libraryFilename)
    log("path: " + path)
    log("forceDownload: " + forceDownload)
    
    if (fm.fileExists(path) && !forceDownload) {
        log("Not downloading library file")
    } else {
        log("Downloading library file '" + library.raw + "' to '" + path + "'")
        const req = new Request(library.raw)
        let libraryFile = await req.load()
        fm.write(path, libraryFile)
    }

    return fm.fileName(scriptPath, false) + '/' + libraryFilename
}
