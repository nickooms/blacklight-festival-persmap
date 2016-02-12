var RangeSlider = div => {
	var slider = {
		input: div.querySelector('input'),
		valueLabel: div.querySelector('span'),
		show: () => this.valueLabel.innerHTML = input.value
	};
	slider.input.addEventListener('input', slider.show)
};
var rangeSlider = () =>	[...document.querySelectorAll('div.range-slider')]
	.forEach(slider => RangeSlider(slider));/*{
		var range = slider.querySelector('input'),
			value = slider.querySelector('span'),
			val = range.value;
		value.innerHTML = val;
		range.addEventListener('input', function(evt) {
			value.innerHTML = range.value;
		}, false);
	});*/