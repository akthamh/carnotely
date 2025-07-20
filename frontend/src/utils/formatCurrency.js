export const formatCurrency = (value, currency) => {
	const currencySymbols = {
		AFN: "؋",
		USD: "$",
		EUR: "€",
		INR: "₹",
		PKR: "₨",
		AED: "د.إ",
		Other: "₪",
	};
	return `${currencySymbols[currency] || "$"}${
		isNaN(value) || value == null ? "0.00" : value.toFixed(2)
	}`;
};
