utools.onPluginEnter(({code}) => {
    if(window.codeChanged) {
        console.log('windowCode')
        window.codeChanged(code)
    }
});