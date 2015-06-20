/// <reference path="../scripts/typings/easeljs/easeljs.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var objects;
(function (objects) {
    // BUTTON CLASS +++++++++++++++++++++++++++++
    var Button = (function (_super) {
        __extends(Button, _super);
        // CONSTRUCTOR +++++++++++++++++++++++++++
        function Button(imageString, x, y, centered) {
            _super.call(this, textureAtlas, imageString);
            if (centered) {
                this.regX = this.getBounds().width * 0.5;
                this.regY = this.getBounds().height * 0.5;
            }
            this.x = x;
            this.y = y;
            // creating event listeners for mouseover and mouseout events
            this.on("mouseover", this.OnOver, this);
            this.on("mouseout", this.OnOut, this);
        }
        // PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++++++++
        Button.prototype.OnOver = function (event) {
            this.alpha = 0.8; // 80% opacity
        };
        Button.prototype.OnOut = function (event) {
            this.alpha = 1.0; // 100% opacity
        };
        return Button;
    })(createjs.Sprite);
    objects.Button = Button;
})(objects || (objects = {}));
//# sourceMappingURL=button.js.map