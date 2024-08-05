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

window.replaceUrl = function (concretePath){
    return path.join(__dirname, concretePath)
}

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
    let cmd = cmds.mac;
    if(utools.isWindows()){
        cmd = cmds.windows
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
const saveBackupFiles = (type, backupDir, content)=>{
    // 确保备份文件夹存在
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }
    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '');
    const filename = `${type}_${timestamp}.txt`;
    const filePath = path.join(backupDir, filename);
    fs.writeFile(filePath, content, err => {
        if (err) {
            console.error(err);
        }
    });
    const files = fs.readdirSync(backupDir).filter(file => file.startsWith(`${type}_`) && file.endsWith('.txt'));
    if (files.length > 30) {
        // 按时间排序，删除最早的备份文件
        files.sort().slice(0, files.length - 30).forEach(file => {
            fs.unlinkSync(path.join(backupDir, file));
            console.log(`Deleted old backup: ${file}`);
        });
    }
}
const readFile = (path1)=>{
    return fs.readFileSync(path.join(__dirname, path1), { encoding: 'utf8', flag: 'r' }).toString();
}

window.services = {
    exec,
    saveBackupFiles,
    readFile
}
