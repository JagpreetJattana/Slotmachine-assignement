module objects {
    export class Label extends createjs.Text {
        constructor(labelText:string, x:number, y:number, centered:boolean) {
            super(labelText, config.FONT_SMALL + " " + config.FONT_FAMILY, config.BLACK);

            if (centered) {
                this.regX = this.getMeasuredWidth() * 0.5;
                this.regY = this.getMeasuredHeight() * 0.5;
            }

            this.x = x;
            this.y = y;
        }
    }
} 