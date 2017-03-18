var frameModule = require("ui/frame");
var exitMod = require('nativescript-exit')
exports.pageLoaded = (args) => {
    let page = args.object
}

exports.checkLogin = ()=>{
    var topmost = frameModule.topmost();    
    topmost.navigate("views/user/user");
}

exports.checkLogout = ()=>{
    exitMod.exit()
}