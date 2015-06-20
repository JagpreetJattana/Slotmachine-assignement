/// <reference path="../scripts/typings/easeljs/easeljs.d.ts" />


module objects {
    // BUTTON CLASS +++++++++++++++++++++++++++++
    export class Button extends createjs.Sprite {
        // CONSTRUCTOR +++++++++++++++++++++++++++
        constructor(imageString: string, x: number, y: number, centered: boolean) {
            super(textureAtlas, imageString);

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
        public OnOver(event: createjs.MouseEvent): void {
            this.alpha = 0.8; // 80% opacity
        }

        public OnOut(event: createjs.MouseEvent): void {
            this.alpha = 1.0; // 100% opacity
        }

    }

} 