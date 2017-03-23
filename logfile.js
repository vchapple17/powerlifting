const fs = require("fs");
const Console = console.constructor;

// redirect global console object to log file
function logfile(file) {
    var con = new Console(fs.createWriteStream(file));
    Object.keys(Console.prototype).forEach(name => {
        console[name] = function() {
            con[name].apply(con, arguments);
        };
    });
}

module.exports = logfile;
