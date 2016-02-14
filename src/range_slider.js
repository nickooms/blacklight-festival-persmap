var RangeSlider = div => {
	var slider = {
		input: $('input', div),
		valueLabel: $('span', div),
		show: () => slider.valueLabel.innerHTML = slider.input.value
	};
	slider.input.addEventListener('input', slider.show);
	slider.input.addEventListener('change', slider.show);
};

var rangeSlider = () =>	[...$$('div.range-slider')]
	.forEach(slider => RangeSlider(slider));