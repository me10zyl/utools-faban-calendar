utools.onPluginEnter(({code}) => {
    if(window.codeChanged) {
        console.log('windowCode')
        window.codeChanged(code)
    }
});
var spawn = require("child_process").spawn;
function exec(cmd, cwd) {
    return new Promise(function(resolve, reject) {
        var result = spawn('cmd.exe', ['/s', '/c', 'cd C:\\forfaban & git clone https://gitlab.100bm.cn/zengyl/mockserver.git mockserver']);
        result.on('close', function(code) {
            console.log('child process exited with code :' + code);
        });
        result.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        result.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
            reject(new Error(data.toString()));
        });
        resolve();
    });
}

const fs = require('fs');
window.writeFile = (type, content)=>{
    if(type === 'options'){
        fs.writeFile('c:\\itaojingit\\faban\\options.txt', content, err => {
            if (err) {
                console.error(err);
            }
        });
    }else{
        fs.writeFile('c:\\itaojingit\\faban\\calendars.txt', content, err => {
            if (err) {
                console.error(err);
            }
        });

    }
}




window.services = {
    exec
}
