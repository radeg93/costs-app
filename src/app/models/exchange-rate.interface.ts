export interface ExchangeRate {
	sourceCurrency: string;
	paymentCurrencies: Array<PaymentCurrency>;
}

export interface PaymentCurrency {
	fromCurrency: string;
	toCurrency: string;
	exchangeRate: number;
}
