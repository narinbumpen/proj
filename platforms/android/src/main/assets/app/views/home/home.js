var Observable = require("data/observable").Observable;
var frameModule = require("ui/frame");

var login = new Observable({
    username: "",
    password: "",
});
exports.pageLoaded = (args) => {
    let page = args.object
    page.bindingContext = login;
}

exports.checkLogin = ()=>{
    var topmost = frameModule.topmost();    
    topmost.navigate("views/user/user");
}

// exports.goRegister = function(){
//     var topmost = frameModule.topmost();    
//     topmost.navigate("views/register/register");
// }