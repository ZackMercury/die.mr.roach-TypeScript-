export interface RGB {
	r:number;
	g:number;
	b:number;
}

export default class Color {
	private _hue:number = 0;
	private _saturation:number = 0;
	private _value:number = 0;

	constructor(hue:number = 0, saturation:number = 0, value:number = 0) 
	{
		this.hue = hue;
		this.saturation = saturation;
		this.value = value;
	}

	public getRGB():RGB
	{
		let hi:number = Math.floor(this._hue / 60) % 6;
		let vMin:number = (100 - this._saturation * 100) * this._value; 

		let a:number = (this._value * 100 - vMin) * (this._hue % 60) / 60;
		let vInc:number = vMin + a;
		let vDec:number = this._value * 100 - a;

		let rgb:RGB = {r:0, g:0, b:0};
		switch(hi)
		{
			case 0:
				rgb.r = this._value;
				rgb.g = vInc / 100;
				rgb.b = vMin / 100; 
				break;
			case 1:
				rgb.r = vDec / 100;
				rgb.g = this._value;
				rgb.b = vMin / 100; 
				break;
			case 2:
				rgb.r = vMin / 100;
				rgb.g = this._value;
				rgb.b = vInc / 100; 
				break;
			case 3:
				rgb.r = vMin / 100;
				rgb.g = vDec / 100;
				rgb.b = this._value; 
				break;
			case 4:
				rgb.r = vInc / 100;
				rgb.g = vMin / 100;
				rgb.b = this._value; 
				break;
			case 5:
				rgb.r = this._value;
				rgb.g = vMin / 100;
				rgb.b = vDec / 100; 
				break;
		}

		return rgb;
	}

	public setRGB(rgb:RGB):void
	{
		if (rgb.r > 1) rgb.r = 1;
		else if (rgb.r < 0) rgb.r = 0;
		if (rgb.g > 1) rgb.g = 1;
		else if (rgb.g < 0) rgb.g = 0;
		if (rgb.b > 1) rgb.b = 1;
		else if (rgb.b < 0) rgb.b = 0; 

		let min:number = Math.min(rgb.r, rgb.g, rgb.b);
		let max:number = Math.max(rgb.r, rgb.g, rgb.b);

		if (max == min) this._hue = 0; 
		else if ((max == rgb.r) && (rgb.g >= rgb.b)) 
			this._hue = (60 * (rgb.g - rgb.b)) / (max - min); 
		else if ((max == rgb.r) && (rgb.g < rgb.b)) 
			this._hue = (60 * (rgb.g - rgb.b)) / (max - min) + 360; 
		else if (max == rgb.g) 
			this._hue = (60 * (rgb.b - rgb.r)) / (min - max) + 120; 
		else 
			this._hue = (60 * (rgb.r - rgb.g)) / (max - min) + 240; 
		if(max == 0) this._saturation = 0;
		else this._saturation = 1 - min / max;
		this._value = max;
	}

	public setHex(hex:number):void
	{
		var rgb:RGB = { r: (hex >> 16) & 0xFF, g: (hex >> 8) & 0xFF, b: hex & 0xFF };
		rgb.r /= 0xFF;
		rgb.g /= 0xFF;
		rgb.b /= 0xFF;

		this.setRGB(rgb);
	}

	public getHex():number
	{
		var rgb:RGB = this.getRGB();
		return (Math.round(rgb.r * 0xFF) << 16) | (Math.round(rgb.g * 0xFF) << 8) | (Math.round(rgb.b * 0xFF));
	}

	//GET/SET
	public get hue():number
	{
		return this._hue;
	}

	public set hue(val:number)
	{
		if (val < 0)
			val += Math.ceil(-val / 360) * 360;
		if (val >= 360)
			val -= Math.trunc(val / 360) * 360;
			this._hue = val;
	}

	public get saturation():number
	{
		return this._saturation;
	}

	public set saturation(val:number)
	{
		if (val < 0)
			val = 0;
		if (val > 1)
			val = 1; 
		this._saturation = val;
	}

	public get value():number
	{
		return this._value;
	}

	public set value(val:number)
	{
		if (val < 0)
			val = 0;
		if (val > 1)
			val = 1; 
		this._value = val;
	}
}