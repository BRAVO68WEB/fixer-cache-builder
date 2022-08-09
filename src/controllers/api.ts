import { CacheClient } from "../helpers/cacheDB";
import needle from "needle";

import { apiConfig } from "../config";

const API_URL = apiConfig.apiURL;
const SupportedSymbols = apiConfig.supportedSymbols.join(",");
const BaseSymbol = apiConfig.baseSymbol;
const API_KEY = apiConfig.apiKey;

export const convertToBase = async (amount: number, current: string) => {
  if (current === BaseSymbol) return amount;
  const rate = await CacheClient.get(`${BaseSymbol}_${current}`);
  const parsedRate = parseInt(rate || "0");
  if (!parsedRate || isNaN(parsedRate))
    return {
      status: false,
      errorMsg: `No conversion rate available for exchange ${BaseSymbol} and ${current}`,
      value: 0,
    };
  return {
    status: true,
    value: amount * parsedRate,
    errorMsg: null,
  };
};

export const convertFromBase = async (amount: number, target: string) => {
  const rate = await CacheClient.get(`${BaseSymbol}_${target}`);
  const parsedRate = parseInt(rate || "0");
  if (!parsedRate || isNaN(parsedRate))
    return {
      status: false,
      errorMsg: `No conversion rate available for exchange ${BaseSymbol} and ${target}`,
      value: 0,
    };
  return {
    status: true,
    value: amount / parsedRate,
    errorMsg: null,
  };
};

export const fetchFixerData = async () => {
  try {
    const data = await needle(
      "get",
      `${API_URL}?symbols=${SupportedSymbols}&base=${BaseSymbol}`,
      {
        json: true,
        headers: {
          apiKey: API_KEY,
        },
      }
    ).then((r) => r.body);
    CacheClient.set(`Last_Updated`, data.date);
    CacheClient.set(`${BaseSymbol}_${BaseSymbol}`, "1");
    for (const k in data.rates) {
      CacheClient.set(`${BaseSymbol}_${k}`, data.rates[k]);
    }

    return data;
  } catch (err: any) {
    console.log("Err :- ", err.message);
  }
};

export const loadFixerData = async () => {
  console.log("🔄 Started loading fixer data with Base Currency ", BaseSymbol);
  fetchFixerData();
  console.log("🔄 Setting auto fetch using intervals ... ");
  setInterval(async () => {
    console.log("🔄 Fetching new data from Fixer");
    fetchFixerData();
  }, 6 * 60 * 1000);
};
