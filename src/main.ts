import {AnimatedSprite, Application,filters,Sprite,Texture,TilingSprite, BLEND_MODES, Graphics, Container} from 'pixi.js'
import Roach, { RoachState } from './Roach'
import TextField from './comps/TextField';
import Tween from './utils/Tween';
import Vector2, { Point } from './utils/Vector2';


const APP_WIDTH:number = 1000;
const APP_HEIGHT:number = 1000;

const app:Application = new Application({
    width: APP_WIDTH,
    height: APP_HEIGHT,
    antialias: true
});
document.body.appendChild(app.view);

app.loader
    .add("res/roach.json")
    .add("res/bg.jpg")
    .add("res/lamp.png")
    .add("res/vignette.png")
    .load(loadJSON);

let timeElapsed:number = 0;
let jsonData;

function loadJSON():void
{
    fetch("res/enemies.json").then((res)=>res.ok?res.json():null).then(obj=>{jsonData = obj; onAssetsLoaded();});
}

function onAssetsLoaded():void
{
    Tween.init(app);

    const backgroundTexture = Texture.from('res/bg.jpg');
    let background = new TilingSprite(backgroundTexture, APP_WIDTH, APP_HEIGHT);
    app.stage.addChild(background);
    let roaches:Roach[] = [];
    jsonData.enemies.forEach((enemy:Point, i:number) => {
        let roach = new Roach(enemy.x, enemy.y);
        roach.seed = i;
        roach.position = Vector2.random().scale(APP_WIDTH/2).add(new Vector2(APP_WIDTH/2, APP_HEIGHT/2));
        roaches.push(roach);
        app.stage.addChild(roach);
    });

    let lamp:Sprite = Sprite.from("res/lamp.png");
    lamp.pivot.set(278, 45);
    lamp.x = 700;
    lamp.scale.x = lamp.scale.y = 0.3;
    let blur:filters.BlurFilter = new filters.BlurFilter();
    blur.blur = 10;
    lamp.filters = [blur];
    app.stage.addChild(lamp);

    let vignette:Sprite = Sprite.from("res/vignette.png");
    vignette.width = APP_WIDTH;
    vignette.height = APP_HEIGHT;
    app.stage.addChild(vignette);
    vignette.blendMode = BLEND_MODES.MULTIPLY;

    let counter:TextField = new TextField("Roaches left: " + roaches.length.toString());
    counter.x = 20;
    app.stage.addChild(counter);

    let gameOverScreen:Container = new Container();
    let g:Graphics = new Graphics()
        .beginFill(0, 1)
        .drawRect(0, 0, APP_WIDTH, APP_HEIGHT);
    gameOverScreen.addChild(g);
    let gameOverText:TextField = new TextField("You killed all roaches. Refresh the page to try again.");
    gameOverText.position.set((APP_WIDTH - gameOverText.width)/2, (APP_HEIGHT - gameOverText.height)/2);
    gameOverScreen.addChild(gameOverText);
    gameOverScreen.alpha = 0;
    app.stage.addChild(gameOverScreen);


    app.ticker.add(update);

    function update(dt:number)
    {
        timeElapsed += dt;
        roaches.forEach(roach=>roach.update(dt));
        
        for(let i:number = 0; i < roaches.length; i++)
        {
            if(roaches[i].state == RoachState.DEAD)
            {
                let r = roaches[i];
                Tween.ease(r, {"scale.x":r.scale.x, "scale.y":r.scale.y, "alpha":1}, {"scale.x":1, "scale.y":1, "alpha":0}, 10).then(_=>app.stage.removeChild(r));
                roaches.splice(i, 1);
                i--;
            }
        }

        counter.text = "Roaches left: " + roaches.length.toString();
        if(!roaches.length)
        {
            app.ticker.remove(update);
            Tween.ease(gameOverScreen, {"alpha":0}, {"alpha":1}, 10);
        }

        lamp.rotation = 0.05 * Math.sin(timeElapsed/20);
    }
}