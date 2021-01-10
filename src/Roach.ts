import { Texture, Sprite, AnimatedSprite } from 'pixi.js';
import Entity from './Entity';
import Float from './utils/Float';
import Vector2 from './utils/Vector2';

export enum RoachState { IDLE, RUN, DEAD }

export default class Roach extends Entity
{
    //Sprites
    private SPR_IDLE:Sprite;
    private SPR_RUN:AnimatedSprite;
    private SPR_DEAD:Sprite;
    //Consts
    public static TEX_SIZE:number = 256;
    public static SAFE_RADIUS:number = 100;
    //Properties
    public goal:Vector2;
    public speed:number;
    public seed:number;

    constructor(x:number = 0, y:number = 0)
    {
        super();
        this.initSprites();
        this.goal = new Vector2(x, y);
        
        this.state = RoachState.IDLE;
        this.speed = 5;
        this.seed = 0;
        this.pivot.x = this.pivot.y = 0.5 * Roach.TEX_SIZE;
        this.scale.x = this.scale.y = 0.5;
        //Events
        this.interactive = true;
        this.on("pointerdown", (e:PointerEvent)=>{
            this.state = RoachState.DEAD;
        });
    }

    //Methods
    private stateFunction():RoachState
    {
        return Math.sin(this.timeElapsed*0.2*(this.seed/5) + this.seed * 100) > 0 ? RoachState.IDLE:RoachState.RUN;
    }

    private initSprites():void
    {
        this.SPR_IDLE = Sprite.from('0004.png');
        this.SPR_DEAD = Sprite.from('dead.png');
        let runCycle:Texture[] = [];
        for(let i:number = 1; i < 9; i++)
            runCycle.push(Texture.from("000" + i.toString() + '.png'));
        this.SPR_RUN = new AnimatedSprite(runCycle);
        this.SPR_RUN.play();
    }

    public update(dt:number):void
    {
        super.update(dt);
        if(this.state != RoachState.DEAD)
        {
            if(this.state != this.stateFunction())
            {
                this.state = this.stateFunction();
                this.velocity = Vector2.random();
                this.rotation = this.velocity.angle;
            }

            switch(this.state)
            {
                case RoachState.IDLE:
                    
                    break;
                case RoachState.RUN:
                    if(Vector2.distance(this.position, this.goal) > Roach.SAFE_RADIUS)
                        this.velocity = this.goal.subtract(this.position).normalize();
                    this.velocity = this.velocity.normalize().scale(this.speed * dt);
                    this.rotation = this.velocity.angle + Math.PI/2;
                    this.position.x += this.velocity.x;
                    this.position.y += this.velocity.y;
                    break;
            }
        }
    }

    protected updateState():void
    {
        console.log(this.state);
        switch(this.state)
        {
            case RoachState.IDLE:
                this.view = this.SPR_IDLE;
                break;
            case RoachState.RUN:
                this.view = this.SPR_RUN;
                break;
            case RoachState.DEAD:
                this.view = this.SPR_DEAD;
                this.interactive = false;
                break;
        }
    }
}