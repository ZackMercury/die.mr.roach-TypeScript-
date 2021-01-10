import {Container, DisplayObject, Sprite} from "pixi.js";
import Vector2 from "./utils/Vector2";

export default abstract class Entity extends Container
{
    private _view:DisplayObject;
    protected timeElapsed:number;
    private _state;
    protected velocity:Vector2;
    protected speed:number;

    constructor()
    {
        super();
        this._view = null;
        this.timeElapsed = 0;
        this.state = -1;
        this.velocity = new Vector2();
        this.speed = 0;
    }

    public get view():DisplayObject { return this._view }
    public set view(v:DisplayObject) 
    { 
        if(this._view === v)
            return;
        if(this._view) 
            this.removeChild(this._view); 
        this._view = v; 
        if(v)
            this.addChild(v);
    }

    public get state(){ return this._state }
    public set state(s) { this._state = s; this.updateState(); }

    public update(dt:number)
    {
        this.timeElapsed += dt;
    }

    protected updateState():void
    {
        
    }
}