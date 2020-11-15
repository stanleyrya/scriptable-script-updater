const DEBUG = true
const log = DEBUG ? console.log.bind(console) : function () { };

// configure the library
const libraryInfo = {
    name: 'widget',
    version: 'main',
    gitlabProject: 'https://raw.githubusercontent.com/stanleyrya/scriptable-widget-busyness-calendar',
    forceDownload: true
}

// download and import library
let library = importModule(await downloadLibrary(libraryInfo))

// create the widget
const params = {
    widgetParameter: args.widgetParameter,
    debug: DEBUG
}
const widget = await library.createWidget(params)

// preview the widget
if (!config.runsInWidget) {
    await widget.presentSmall()
}

Script.setWidget(widget)
Script.complete()

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
    
    let libraryFilename = library.name + '_' + library.version + '.js'
    let path = fm.joinPath(libraryDir, libraryFilename)
    let forceDownload = (library.forceDownload) ? library.forceDownload : false
    log("libraryFilename: " + libraryFilename)
    log("path: " + path)
    log("forceDownload: " + forceDownload)
    
    if (fm.fileExists(path) && !forceDownload) {
        log("Not downloading library file")
    } else {
        let libraryUrl = library.gitlabProject + '/' + library.version + '/' + library.name + '.js'
        log("Downloading library file '" + libraryUrl + "' to '" + path + "'")
        const req = new Request(libraryUrl)
        let libraryFile = await req.load()
        fm.write(path, libraryFile)
    }

    return fm.fileName(scriptPath, false) + '/' + libraryFilename
}
