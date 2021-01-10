import {Container, TextStyle, Graphics, Text} from "pixi.js";
import Color from "../utils/Color"

export enum ClassicButtonState { IDLE, HOVER, DOWN }

export default class ClassicButton extends Container
{
    public static COLOR = 0x991111;
    public static WIDTH = 150;
    public static HEIGHT = 50;
    public static TEXT_SIZE = 14;

    private graphics:Graphics;
    private text:Text;
    private _caption:string;
    private _onClick:Function;
    private _state:ClassicButtonState;

    constructor(caption = "Button", onClick = null)
    {
        super();
        this.graphics = new Graphics();
        this.interactive = true;
        const style:TextStyle = new TextStyle({
            fontFamily: 'Helvetica',
            fontSize: ClassicButton.TEXT_SIZE,
            fill: ["#ffffff"],
            wordWrap: true,
            wordWrapWidth: ClassicButton.WIDTH,
            lineJoin: 'round',
            align: 'center'
        });
        this.text = new Text(caption, style);
        this.addChild(this.graphics);
        this.addChild(this.text);

        this._caption = caption;
        this._onClick = onClick;
        this.state = ClassicButtonState.IDLE;

        this.on("pointerover", this.pointerOver.bind(this))
            .on("pointerdown", this.pointerDown.bind(this))
            .on("pointerup", this.pointerUp.bind(this))
            .on("pointerout", this.pointerOut.bind(this));
    }
    
    pointerOut(e:PointerEvent)
    {
        this.state = ClassicButtonState.IDLE;
    }

    pointerOver(e:PointerEvent){
        this.state = ClassicButtonState.HOVER;
    }

    pointerDown(e:PointerEvent){
        this.state = ClassicButtonState.DOWN;
    }

    pointerUp(e:PointerEvent)
    {
        if (this.state == ClassicButtonState.DOWN && this._onClick)
            this._onClick();
        this.state = ClassicButtonState.HOVER;
    }

    update()
    {
        let g:Graphics = this.graphics;
        g.clear();
        let c:Color = new Color();

        switch(this.state)
        {
            case ClassicButtonState.IDLE:
                g.beginFill(ClassicButton.COLOR);
                break;
            case ClassicButtonState.HOVER:
                c.setHex(ClassicButton.COLOR);
                c.value += 0.1;
                g.beginFill(c.getHex());
                break;
            case ClassicButtonState.DOWN:
                c.setHex(ClassicButton.COLOR);
                c.value -= 0.1;
                g.beginFill(c.getHex());
        }
        g.drawRect(0, 0, ClassicButton.WIDTH, ClassicButton.HEIGHT);
        g.endFill();
        this.text.text = this._caption.toUpperCase();
        this.text.position.x = (ClassicButton.WIDTH - this.text.width)/2;
        this.text.position.y = (ClassicButton.HEIGHT - this.text.height)/2;
    }

    //GET/SET
    set caption(c:string)
    {
        this._caption = c;
        this.update();
    }

    get caption()
    {
        return this._caption;
    }


    set onClick(func:Function){
        this._onClick = func;
    }

    get onClick(){
        return this._onClick;
    }

    get state() { return this._state }
    set state(s:ClassicButtonState) { this._state = s; this.update(); }
}