export enum NoiseInterpolation { LINEAR, CUBIC }

export default class Float
{
    public static interpolation = NoiseInterpolation.LINEAR;

    //Noise method https://github.com/jmcneese/libnoise.js/blob/master/noisegen.js
    private static integerNoise(x:number, seed:number = 1):number
    {
        //to be replaced because of an issue with losing randomness over the range
        x = Math.trunc(x);
        seed = Math.trunc(seed);
		let n:number = Math.trunc((1619 * x + 1013 * seed) & 0x7fffffff);
		n = (n >> 13) ^ n;
        return ((n * (n * n * 60493 + 19990303) + 1376312589) & 0x7fffffff)/1073741824;
        //FUCKEN BROKEN IN TYPESCRIPT
    }

    public static noise(x:number, seed:number=0):number
    {
        const b:number = Float.integerNoise(Math.floor(x), seed);
        const c:number = Float.integerNoise(Math.ceil(x), seed);
        x -= b;

        switch(Float.interpolation)
        {
            case NoiseInterpolation.LINEAR:
                return Float.lerp(x, b, c);
            case NoiseInterpolation.CUBIC:
                const a = Float.integerNoise(Math.floor(x) - 1, seed);
                const d = Float.integerNoise(Math.ceil(x) + 1, seed);
                return (d-c-a+b)*x*x*x + (2*a-2*b-d-c)*x*x + (c-a)*x + b;
        }
    }

    public static clamp(x:number, a:number, b:number):number
    {
        return Math.min(Math.max(a, x), b);
    }

    public static map(x:number, a1:number, b1:number, a2:number, b2:number):number
    {
        return (a2 + b2*(x-a1)/(b1-x))/(1+(x-a1)/(b1-x));
    }

    public static lerp(x:number, a:number, b:number):number
    {
        return a + (b-a)*x;
    }
}