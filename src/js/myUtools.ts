import {Router} from "vue-router";

type To = 'Options' | 'Calendar'
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
    }
}