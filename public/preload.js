var spawn = require("child_process").spawn;
const path = require('node:path');
const fs = require('fs');
const os = require('os');
utools.onPluginEnter(({code}) => {
    if(window.codeChanged) {
        console.log('windowCode')
        window.codeChanged(code)
    }
});
function exec(cmdContent, callback) {
    const tempFilePath = path.join(os.tmpdir(), `utools_temp_script_${+new Date()}.bat`);
    fs.writeFileSync(tempFilePath, cmdContent);
    let cmds = {
        windows : {
            exe : 'cmd.exe',
            args: ['/S','/C', tempFilePath]
        },
        mac : {
            exe : 'bash',
            args: [tempFilePath]
        }
    }
    let cmd = cmds.windows;
    if(utools.isMacOS()){
        cmds = cmds.mac
    }
    let result = spawn(cmd.exe, cmd.args);
    let response = false;
    let lastMessage = ''
    result.on('close', function (code) {
        try {
            callback({
                type : 'finished',
                data: code,
                lastMessage: lastMessage
            });
            console.log('process exited with code ' + code);
        } finally {
            fs.unlinkSync(tempFilePath)
        }
    });
    result.stdout.on('data', function (data) {
        response = true;
        lastMessage = data.toString();
        callback({
            type : 'stdout',
            data: data.toString()
        });
    });
    result.stderr.on('data', function (data) {
        response = true;
        lastMessage = data.toString();
        callback({
            type: 'stderr',
            data: data.toString()
        });
    });
}
const writeFile = (type, basePath, content)=>{
    if(type === 'options'){
        fs.writeFile(path.resolve(basePath, 'options.txt'), content, err => {
            if (err) {
                console.error(err);
            }
        });
    }else{
        fs.writeFile(path.resolve(basePath,'calendars.txt'), content, err => {
            if (err) {
                console.error(err);
            }
        });

    }
}
const readFile = (path1)=>{
    return fs.readFileSync(path.join(__dirname, path1), { encoding: 'utf8', flag: 'r' }).toString();
}

window.services = {
    exec,
    writeFile,
    readFile
}
