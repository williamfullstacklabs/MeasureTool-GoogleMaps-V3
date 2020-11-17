import {Config} from './config';
import css from 'single-context-menu.scss';

export default class SingleContextMenu {
    constructor(overlay, context) {
        this._context = context;

        this._overlay = overlay;
        this._overlay.onAdd = this.onAdd.bind(this);
        this._overlay.draw = this.draw.bind(this);
        this._overlay.onRemove = this.onRemove.bind(this);

        this.displayed = false;
    }

    onAdd() {
        this._overlay.getPanes().floatPane.appendChild(this.containerDiv);
    }
    
    onRemove() {
        if (this.containerDiv.parentElement) {
            this.containerDiv.parentElement.removeChild(this.containerDiv);
        }
    }

    draw() {
        const divPosition = this._overlay.getProjection().fromLatLngToDivPixel(
          this.position
        );
        // Hide the popup when it is far out of view.
        const display =
          Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
            ? "block"
            : "none";
  
        if (display === "block") {
          this.containerDiv.style.left = divPosition.x + "px";
          this.containerDiv.style.top = divPosition.y + "px";
        }
  
        if (this.containerDiv.style.display !== display) {
          this.containerDiv.style.display = display;
        }
    }

    show(position, cb) {
        this.position = position;
        this.cb = cb; 

        this.containerDiv = document.createElement("div");
        this.containerDiv.classList.add(`${Config.prefix}-single-context-menu`);
        this.containerDiv.id = `${Config.prefix}-single-context-menu`;
        this.containerDiv.stylesheet = css;
        this.containerDiv.oncontextmenu = event => event.preventDefault();
        
        let item = document.createElement("div");
        item.className = `${Config.prefix}-single-context-menu-item`;
        item.innerHTML = `
            <span class="${Config.prefix}-context-menu-item-delete-icon"></span>
            <span class="${Config.prefix}-context-menu-item-text">Remove</span>
        `
        item.onclick = (e) => {
            e.preventDefault();
            cb.apply(this._context);
            this.hide();
        };

        this.containerDiv.style.cssText = `
            display: block;
        `;
        
        this.containerDiv.appendChild(item);

        this._overlay.setMap(this._context._map);
        this.displayed = true;
        //this._context._map.panTo(this.position);
    }

    hide() {
        /*
        if (this.containerDiv) {
            this.containerDiv.remove();
            const cm = document.getElementById("measure-tool-single-context-menu");
            if (cm) {
                cm.remove();
            }
        }
        */
        this.displayed = false;
        if (this._overlay) this._overlay.setMap(null);
    }

    isDisplayed() {
        return this.displayed;
    }
}