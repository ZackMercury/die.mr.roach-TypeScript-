import { Text, TextStyle } from "pixi.js";


export default class TextField extends Text
{
    public static TEXT_SIZE:number = 35;
    public static WIDTH:number = 200;
    public static COLOR:string = '#ffffff';

    constructor(text:string, style:TextStyle = null)
    {
        if(!style)
            style = new TextStyle({
                fontFamily: 'Helvetica',
                fontSize: TextField.TEXT_SIZE,
                fill: [TextField.COLOR],
                wordWrap: true,
                wordWrapWidth: TextField.WIDTH,
                lineJoin: 'round',
                align: 'center'
            });
        super(text, style);
    }
}