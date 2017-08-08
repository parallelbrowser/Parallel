/* globals beakerDownloads DatArchive */

import * as yo from 'yo-yo'
import emitStream from 'emit-stream'
import { findParent } from '../../../lib/fg/event-handlers'
import * as pages from '../../pages'


export class BrowserScriptNavbarBtn {
  constructor () {
    this.isDropdownOpen = false
    this.showPre = false
    // wire up events
    window.addEventListener('mousedown', this.onClickAnywhere.bind(this), true)
  }

  render () {
    // render the dropdown if open
    var dropdownEl = ''
    if (this.isDropdownOpen) {
      // give a list of scripts for this page
      // map through and make them lis
      // Make them toggle-able

      //TODO: dont click on the link
      //TODO: dont click on the link
      dropdownEl = yo`
        <div class="script-dropdown dropdown toolbar-dropdown-menu-dropdown">
          <div style="width: 300px" class="dropdown-items script-dropdown with-triangle visible">

            <div class="grid default">
              <div class="grid-item" onclick=${() => this.prePostClick(true)}>
                <i class="fa fa-file-code-o"></i>
                Pre-Scripts
              </div>
              <div class="grid-item" onclick=${() => this.prePostClick(false)}>
                <i class="fa fa-file-text-o"></i>
                Post-Scripts
              </div>
            </div>


            ${this.renderPreOrPost()}

            <div class="footer">
              <a onclick=${e => this.onOpenPage(e, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')}>
                <i class="fa fa-eye"></i>
                <span>View All Scripts</span>
              </a>
              <a onclick=${e => this.onOpenPage(e, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')}>
                <i class="fa fa-user-plus"></i>
                <span>Discover</span>
              </a>
            </div>

          </div>
        </div>`
    }

    // render btn
    return yo`
      <div class="toolbar-dropdown-menu browser-dropdown-scripts">
        <button class="toolbar-btn toolbar-dropdown-menu-btn ${this.isDropdownOpen ? 'pressed' : ''}" onclick=${e => this.onClickBtn(e)} title="Script">
          <span class="fa fa-code"></span>
        </button>
        ${dropdownEl}
      </div>`
  }

  renderPreOrPost () {
    let title = ''

    //TODO: remove after testing, actually retrieve the scripts from somewhere
    //TODO: need to query this from backend instead
    let a = new Date(Date.now())
    let scripts = [{name: 'Title', desc: 'Description of Script', time: a.toDateString(), author: 'Songebob Squarepants', pubKey: 'IAMTHEONETHEONEDONTNEEDAGUNTOGETRESPECTUPONTHESESTREETS'},
                   {name: 'Title', desc: 'Description of Script', time: a.toDateString(), author: 'Songebob Squarepants', pubKey: 'IAMTHEONETHEONEDONTNEEDAGUNTOGETRESPECTUPONTHESESTREETS'}]


    if(this.showPre) {
      title = 'Your Pre-Scripts';
      // TODO scripts = preScriptsQuery
    } else {
      title = 'Your Post-Scripts'
      // TODO scripts = postScriptsQuery
    }

    //TODO: dont click on the link
    return yo`
      <div>
        <div class="section-header">
          <h3>
            <div onclick=${e => this.onOpenPage(e, "https://www.youtube.com/watch?v=dQw4w9WgXcQ")}>
              ${title}
            </div>
          </h3>
        </div>
        <ul>
          ${this.scriptsList(scripts)}
        </ul>
      </div>`
  }

  scriptsList (scripts) {
    var scriptsList = [];

    if(scripts.length === 0){
      scriptsList.push(
        yo`
        <li>
          <div class="list-item">
            No scripts for this page
          </div>
        </li>`
      )
    } else {
      scriptsList = scripts.map((scriptObj) => {
        //TODO: dont click on the link
        return yo`
          <li>
            <div class="list-item">
              <a onclick=${e => this.onOpenPage(e, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')}>
                <div>
                  <span> <b>${scriptObj.name}</b></span>
                  <span> <i>${scriptObj.time}</i></span>
                </div>
                <div>
                  <span> ${scriptObj.desc}</span>
                  <span> <i>${scriptObj.author}</i></span>
                </div>
              </a>
            </div>
          </li>`
      })
    }

    // The last button is an add new scrips button
    scriptsList = scriptsList.concat(
      //TODO: dont click on the link
      yo`
        <li>
          <div class="list-item">
            <a onclick=${e => this.onOpenPage(e, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')}>
              <i class="fa fa-plus"></i>
              <span> Add New Script</span>
            </a>
          </div>
        </li>`
    )

    return scriptsList;
  }

  prePostClick (isPre) {
    if(isPre) {
      this.showPre = true
    } else {
      this.showPre = false
    }
    this.updateActives()
  }

  updateActives () {
    Array.from(document.querySelectorAll('.browser-dropdown-scripts')).forEach(el => yo.update(el, this.render()))
  }

  doAnimation () {
    Array.from(document.querySelectorAll('.browser-dropdown-scripts .toolbar-btn')).forEach(el =>
      el.animate([
        {transform: 'scale(1.0)', color: 'inherit'},
        {transform: 'scale(1.5)', color: '#06c'},
        {transform: 'scale(1.0)', color: 'inherit'}
      ], { duration: 300 })
    )
  }

  onClickBtn (e) {
    this.isDropdownOpen = !this.isDropdownOpen
    this.updateActives()
  }

  onClickAnywhere (e) {
    var parent = findParent(e.target, 'browser-dropdown-scripts')
    if (parent) return // abort - this was a click on us!
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false
      this.updateActives()
    }
  }

  onOpenPage (e, url) {
    pages.setActive(pages.create(url))
    this.isDropdownOpen = false
    this.updateActives()
  }
}