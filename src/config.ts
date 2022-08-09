export type apiConfigType = {
    baseSymbol: string;
    apiKey: string;
    apiURL: string;
    supportedSymbols: string[];
}

export const apiConfig : apiConfigType = {
    apiURL: process.env.FIXER_API_URL || 'https://api.exchangerate.host/latest',
    apiKey: process.env.FIXER_API_KEY || '',
    supportedSymbols: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'SGD'],
    baseSymbol: 'SGD',
}