import { webFrame } from 'electron'
import importWebAPIs from './lib/fg/import-web-apis' // TODO remove
import DatArchive from './lib/web-apis/dat-archive'
import beaker from './lib/web-apis/beaker'
import { setup as setupLocationbar } from './webview-preload/locationbar'
import { setup as setupPrompt } from './webview-preload/prompt'
import setupRedirectHackfix from './webview-preload/redirect-hackfix'

// TCW CHANGES --- import inject scripts

import {setup as setupInjectScripts} from './webview-preload/inject-scripts'

// TCW --END

// HACKS
setupRedirectHackfix()

// register protocol behaviors
/* This marks the scheme as:
 - Secure
 - Allowing Service Workers
 - Supporting Fetch API
 - CORS Enabled
*/
webFrame.registerURLSchemeAsPrivileged('dat', { bypassCSP: false })

// setup APIs
importWebAPIs()
if (['beaker:', 'dat:', 'https:', 'http:'].includes(window.location.protocol) ||
    (window.location.protocol === 'http:' && window.location.hostname === 'localhost')) {
  window.DatArchive = DatArchive
}
if (window.location.protocol === 'beaker:') {
  window.beaker = beaker
}
window.subscriptCredentials = {}
setupLocationbar()
setupPrompt()

// TCW CHANGES -- call inject scripts from webview-preload/inject-scripts

setupInjectScripts()

// TCW -- END
