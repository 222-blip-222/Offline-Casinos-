/*:
 * @plugindesc Adds a menu button on screen for Android/Mobile
 * @author Claude
 *
 * @param Button Text
 * @desc Text on the button
 * @default MENU
 *
 * @param Button Size
 * @desc Size of the button in pixels
 * @default 60
 *
 * @param Position
 * @desc Button position: topleft, topright, bottomleft, bottomright
 * @default bottomright
 *
 * @help
 * Adds a floating MENU button on screen.
 * Tap it to open the game menu (same as pressing X/Escape).
 */

(function() {
    var parameters = PluginManager.parameters('MenuButton');
    var buttonText = String(parameters['Button Text'] || 'MENU');
    var buttonSize = Number(parameters['Button Size'] || 60);
    var position = String(parameters['Position'] || 'bottomright');

    var _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createMenuButton();
    };

    Scene_Map.prototype.createMenuButton = function() {
        var btn = document.createElement('button');
        btn.id = 'rpgMenuButton';
        btn.innerText = buttonText;

        var size = buttonSize + 'px';
        var margin = '12px';

        btn.style.cssText = [
            'position: fixed',
            'z-index: 9999',
            'width: ' + size,
            'height: ' + size,
            'background: rgba(0,0,0,0.55)',
            'color: #fff',
            'border: 2px solid rgba(255,255,255,0.5)',
            'border-radius: 10px',
            'font-size: 13px',
            'font-weight: bold',
            'cursor: pointer',
            'touch-action: manipulation',
            'user-select: none',
            '-webkit-user-select: none'
        ].join(';');

        if (position === 'topleft')     { btn.style.top = margin;    btn.style.left = margin; }
        if (position === 'topright')    { btn.style.top = margin;    btn.style.right = margin; }
        if (position === 'bottomleft')  { btn.style.bottom = margin; btn.style.left = margin; }
        if (position === 'bottomright') { btn.style.bottom = margin; btn.style.right = margin; }

        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (SceneManager._scene instanceof Scene_Map) {
                SceneManager._scene.callMenu();
            }
        });

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (SceneManager._scene instanceof Scene_Map) {
                SceneManager._scene.callMenu();
            }
        });

        document.body.appendChild(btn);
        this._menuButton = btn;
    };

    var _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        _Scene_Map_terminate.call(this);
        var btn = document.getElementById('rpgMenuButton');
        if (btn) btn.parentNode.removeChild(btn);
    };
})();
