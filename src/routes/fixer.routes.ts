import { Router } from "express";
import { CacheClient } from "../helpers/cacheDB";
import { convertToBase, convertFromBase } from "../controllers/api";
import { apiConfig } from "../config";

const router = Router();

router.get("/convert", async (req, res, next) => {
  try {
    const symbol = req.query.symbol?.toString() || "INR";
    const amount = parseInt(req.query.amount?.toString() || "1");
    const { baseSymbol } = apiConfig;
    const resp = (await convertToBase(amount, symbol)) as any;
    return res.status(200).json({
      status: resp.status,
      from: symbol,
      to: baseSymbol,
      value: resp.value,
      errorMsg: resp.errorMsg,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      res.json({
        error: err.message,
      });
    }
  }
});

router.get("/revert", async (req, res, next) => {
  try {
    const symbol = req.query.symbol?.toString() || "INR";
    const amount = parseInt(req.query.amount?.toString() || "1");
    const { baseSymbol } = apiConfig;
    const resp = (await convertFromBase(amount, symbol)) as any;
    return res.status(200).json({
      status: resp.status,
      from: symbol,
      to: baseSymbol,
      value: resp.value,
      errorMsg: resp.errorMsg,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      res.json({
        error: err.message,
      });
    }
  }
});

export default router;
