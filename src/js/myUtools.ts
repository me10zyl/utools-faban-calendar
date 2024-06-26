import {Router} from "vue-router";
import {SelectCustomForm, SelectEnv, SelectProject} from "./calendar";
import myStorage from "./myStorage";
import {ElMessage} from "element-plus";
import {CustomForm, Env} from "./options";

type To = 'Options' | 'Calendar'
export type CmdVars = {
    project? : SelectProject
    env? :SelectEnv
    customForm? : SelectCustomForm
}
export default {
    init: function (router: Router) {
        // @ts-ignore
        window.codeChanged = (code) => {
            if (code === 'faban-conf') {
                router.replace('/options')
            } else if (code === 'faban') {
                router.replace('/')
            }
        }
    },
    redirect: function redirect(to: To): void {
        if(to === 'Options') {
            // @ts-ignore
            utools.redirect('faban-conf')
        }else if(to === 'Calendar'){
            // @ts-ignore
            utools.redirect('faban')
        }
    },
    copy(value: string) {
        // @ts-ignore
        utools.copyText(value)
    },
    shellOpen(value: string){
        // @ts-ignore
        utools.shellOpenExternal(value)
    },
    evaluateCmd(cmd:string, vars?:CmdVars, callback?: Function): string{
        let options = myStorage.getOptions();
        if(!options.defaultOptions.basePath || options.defaultOptions.basePath.trim() === ''){
            ElMessage('全局配置-项目基础路径不能为空')
            return
        }
        for(let key in options.defaultOptions){
            //@ts-ignore
            cmd = cmd.replaceAll(`{{${key}}}`,options.defaultOptions[key])
        }
        if(vars) {
            if (vars.project) {
                for(let key in vars.project){
                    //@ts-ignore
                    cmd = cmd.replaceAll(`{{${key}}}`,vars.project[key])
                }
            }
            if(vars.env){
                for(let key in vars.env){
                    //@ts-ignore
                    cmd = cmd.replaceAll(`{{${key}}}`,vars.env[key])
                }
            }
            if(vars.customForm){
                for(let key in vars.customForm){
                    //@ts-ignore
                    cmd = cmd.replaceAll(`{{${key}}}`,vars.customForm[key])
                }
            }
        }
        console.log('exec', cmd)
        // @ts-ignore
        window.services.exec(cmd, callback)

        return cmd;
    },
    isDev():string{
        // @ts-ignore
        return utools.isDev();
    },
    readFile(path):string{
        // @ts-ignore
        return window.services.readFile(path)
    }
}