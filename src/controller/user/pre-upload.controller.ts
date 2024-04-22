import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Request, Response } from "express";
import { s3 } from "../../config/aws";

export const preUpload = async (req: Request, res: Response) => {
    const { fileKey, contentType } = req.body;
    try {
        if (!fileKey || !contentType) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const preSignedUrlBuildCommand = new PutObjectCommand({
            Bucket: "circulate-dev-new",
            Key: `upload/${fileKey}`,
            ContentType: contentType
        });
        const preSignedUrl = await getSignedUrl(s3, preSignedUrlBuildCommand, { expiresIn: 60 * 60 * 24 });
        return res.status(200).json({
            url: preSignedUrl
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
