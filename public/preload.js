utools.onPluginEnter(({code}) => {
    if(window.codeChanged) {
        console.log('windowCode')
        window.codeChanged(code)
    }
});
var spawn = require("child_process").spawn;
function exec(cmd) {
    return new Promise(function(resolve, reject) {
        var result = spawn('cmd.exe', ['/s', '/c', cmd]);
        result.on('close', function(code) {
            console.log('child process exited with code :' + code);
        });
        result.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        result.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
            reject(new Error(stderr.toString()));
        });
        resolve();
    });
}

window.services = {
    exec
}
