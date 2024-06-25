let spawn = require("child_process").spawn;
const path = require('node:path');
const fs = require('fs');
const os = require('os');

function replaceVars(data) {
    return data;
}

function exec(cmdPath, callback) {
    const tempFilePath = path.join(os.tmpdir(), `utools_temp_script_${+new Date()}.bat`);
    const data = fs.readFileSync(cmdPath, { encoding: 'utf8', flag: 'r' });
    fs.writeFileSync(tempFilePath, replaceVars(data));
    let result = spawn('cmd.exe', ['/S','/C', tempFilePath]);
    let response = false;
    result.on('close', function (code) {
        try {
            callback({
                type : 'finished',
                data: code
            });
            console.log('process exited with code ' + code);
        } finally {
            fs.unlinkSync(tempFilePath)
        }
    });
    result.stdout.on('data', function (data) {
        response = true;
        callback({
            type : 'stdout',
            data: data.toString()
        });
    });
    result.stderr.on('data', function (data) {
        response = true;
        callback({
            type: 'stderr',
            data: data.toString()
        });
    });
}

exec('c:\\forfaban-script\\merge.bat', (e)=>{
    console.log(e.type + ":",e.data)
})