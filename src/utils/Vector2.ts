export interface Point
{
    x:number;
    y:number;
}

export default class Vector2 implements Point
{
    public x:number;
    public y:number;

    constructor(x:number = 0, y:number = 0)
    {
        this.x = x;
        this.y = y;
    }

    public normalize(length:number = 1):Vector2
    {
        return this.scale(1/this.length*length);
    }

    public scale(s:number):Vector2
    {
        return new Vector2(this.x * s, this.y * s);
    }

    public subtract(vec:Point):Vector2
    {
        return new Vector2(this.x - vec.x, this.y - vec.y);
    }

    public add(vec:Point):Vector2
    {
        return new Vector2(this.x + vec.x, this.y + vec.y);
    }

    public get length():number
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public dot(vec:Point):number
    {
        return this.x * vec.x + this.y * vec.y;
    }

    public clone():Vector2
    {
        return new Vector2(this.x, this.y);
    }

    public cw():Vector2
    {
        return new Vector2(-this.y, this.x);
    }

    public ccw():Vector2
    {
        return new Vector2(this.y, -this.x);
    }

    public spinCW(n:number):Vector2
    {
        return new Vector2(n%4==0?this.x:n%4==1?-this.y:n%4==2?-this.x:this.y, n%4==0?this.y:n%4==1?this.x:n%4==2?-this.y:-this.x)
    }

    public get angle():number
    {
        return Math.atan2(this.y, this.x);
    }

    public copyFrom(p:Point):Vector2
    {
        return new Vector2(p.x, p.y);
    }

    public copyTo(p:Point):Vector2
    {
        [p.x, p.y] = [this.x, this.y];
        return this;
    }

    public set(x:number, y:number):Vector2
    {
        return new Vector2(x,y);
    }

    public equals(p:Point):boolean
    {
        return this.x == p.x && this.y == p.y;
    }

    public static random():Vector2
    {
        return (new Vector2(Math.random() - 0.5, Math.random()-0.5)).normalize();
    }

    public static fromPoint(p:Point):Vector2
    {
        return new Vector2(p.x, p.y);
    }

    public static distance(v1:Point, v2:Point):number
    {
        return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
    }
}