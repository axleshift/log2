import express from "express";
import { createPayment, getPayments, getPaymentById, updatePayment, deletePayment } from "../../controller/payments.js";

const paymentRouter = express.Router();

paymentRouter.post("/", createPayment);
paymentRouter.get("/", getPayments);
paymentRouter.get("/:id", getPaymentById);
paymentRouter.put("/:id", updatePayment);
paymentRouter.delete("/:id", deletePayment);

export default paymentRouter;
