import {Config} from './config';
import css from 'single-context-menu.scss';

export default class SingleContextMenu {
    constructor(parentContainer) {
        this._parentContainer = parentContainer;
    }

    create() {
        this._singleContextMenu = document.createElement("div");
        this._singleContextMenu.classList.add(`${Config.prefix}-single-context-menu`);
        this._singleContextMenu.id = `${Config.prefix}-single-context-menu`;
        this._singleContextMenu.stylesheet = css;
        this._singleContextMenu.oncontextmenu = event => event.preventDefault();

        this._parentContainer.appendChild(this._singleContextMenu);
    }

    show(point, cb, context) {
        this.create();
        let item = document.createElement("div");
        item.className = `${Config.prefix}-single-context-menu-item`;
        item.innerHTML = `
            <span class="${Config.prefix}-context-menu-item-delete-icon"></span>
            <span class="${Config.prefix}-context-menu-item-text">Remove</span>
        `
        item.onclick = (e) => {
            e.preventDefault();
            cb.apply(context);
            this.hide();
        };

        this._singleContextMenu.style.cssText = `
            display: block;
            visibility: hidden;
            position: absolute;
        `;

        this._singleContextMenu.appendChild(item);  
        
        let isXOverflow = this._parentContainer.getBoundingClientRect().width <= point.x + this._singleContextMenu.getBoundingClientRect().width;
        let isYOverflow = this._parentContainer.getBoundingClientRect().height <= point.y + this._singleContextMenu.getBoundingClientRect().height;

        this._singleContextMenu.style.cssText += `
            ${isXOverflow ? "right: 0px;" : "left: " + point.x + "px;"}
            ${isYOverflow ? "bottom: 14px;" : "top: " + point.y + "px;"}
            visibility: visible;
        `;
    }

    hide() {
        if (this._singleContextMenu) {
            this._singleContextMenu.remove();
            const cm = document.getElementById("measure-tool-single-context-menu");
            if (cm) {
                cm.remove();
            }
        }
    }
}