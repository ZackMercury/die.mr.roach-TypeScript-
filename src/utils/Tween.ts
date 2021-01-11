import { Application } from "pixi.js";
import Float from "./Float";

export enum TweenType { LINEAR, CUBIC_IN, CUBIC_OUT, CIRCULAR_IN, CIRCULAR_OUT, BEZIER_IN_OUT }

interface Transition 
{
    object:object;
    duration:number;
    timeElapsed:number;
    from:object;
    to:object;
    fun:TweenType;
    whenDone:Function;
}

export default class Tween {
    private static transitions:Transition[] = [];

    public static init(app:Application):void
    {
        app.ticker.add(this.update);
    }

    private static lowestLevel(obj:object, paramAddress:string):object
    {
        paramAddress.split(".").forEach((prop:string, i:number, arr:string[])=>{
            if(i < arr.length - 1)
                obj = obj[prop];
        })
        return obj;
    }

    public static ease(obj:object, fromParams:object, toParams:object, duration:number, easingFunction:TweenType = TweenType.LINEAR):Promise<void>
    {
        let t:Transition = {object: obj, duration:duration, timeElapsed:0, from:fromParams, to:toParams, fun:easingFunction, whenDone:null};
        Tween.transitions.push(t);
        return new Promise(resolve=>{
            t.whenDone = resolve;
        });
    }

    private static update(dt:number):void
    {
        Tween.transitions.forEach((t:Transition)=>{
            t.timeElapsed += dt;
            Object.keys(t.from).forEach(key=>{
                let a:number = t.from[key];
                let b:number = t.to[key];
                let x:number = t.timeElapsed/t.duration;
                let obj:object = Tween.lowestLevel(t.object, key);
                let prop:string = key.split(".").pop();
                switch(t.fun)
                {
                    case TweenType.LINEAR:
                        obj[prop] = Float.lerp(x, a, b);
                        break;
                    case TweenType.CUBIC_IN:
                        obj[prop] = Float.lerp(x*x*x, a, b);
                        break;
                    case TweenType.CUBIC_OUT:
                        obj[prop] = Float.lerp(x*x*x-3*x*x+3*x, a, b);
                        break; 
                    case TweenType.CIRCULAR_IN:
                        obj[prop] = Float.lerp(1-Math.sqrt(1-x*x), a, b);
                        break;
                    case TweenType.CIRCULAR_OUT:
                        obj[prop] = Float.lerp(Math.sqrt(x*(2-x)), a, b);
                        break;   
                    case TweenType.BEZIER_IN_OUT:
                        obj[prop] = Float.lerp(x*x*(3-2*x), a, b);
                        break;
                }

                if(t.timeElapsed > t.duration)
                    obj[prop] = b;
            })
            
            if(t.timeElapsed > t.duration)
            {
                Tween.transitions.splice(Tween.transitions.indexOf(t), 1);
                if(t.whenDone)
                    t.whenDone();
            }
        })
    }
}
