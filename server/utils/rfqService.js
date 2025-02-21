import nodemailer from "nodemailer";
import { TokenService } from "./tokenService.js";
import User from "../models/UserModel.js";
import RFQ from "../models/RFQ.js";

export const generateInviteToken = async (rfqId, vendorId) => {
    try {
        const vendor = await User.findById(vendorId);
        const rfq = await RFQ.findById(rfqId);

        if (!vendor) {
            throw new Error("Vendor not found");
        }
        if (!rfq) {
            throw new Error("RFQ not found");
        }

        const payload = { rfqId, vendorId };

        const token = TokenService.generateAccessToken(payload, "1h");

        await RFQ.updateOne({ _id: rfqId }, { $push: { invites: { vendorId, token } } });

        const inviteLink = `${process.env.FRONTEND_URL}/rfq/${rfqId}/invite?token=${token}`;

        await sendEmail(vendor.email, rfqId, inviteLink);

        return inviteLink;
    } catch (error) {
        console.error("Error generating invite token:", error);
        throw new Error(error.message);
    }
};
