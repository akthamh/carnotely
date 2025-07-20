export const formatDistance = (value, unit) => {
	if (isNaN(value) || value == null) return `0.00 ${unit}`;
	const formattedValue = Number(value).toFixed(2);
	return `${formattedValue} ${unit}`;
};
