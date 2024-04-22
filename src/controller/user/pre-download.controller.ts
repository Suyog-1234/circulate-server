import { GetObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Request, Response } from "express";
import { s3 } from "../../config/aws";

export const preDownload = async (req: Request, res: Response) => {
    const { fileKey } = await req.body;
    try {
        const preSignedUrlBuildCommand = new GetObjectCommand({
            Bucket: "circulate-dev-new",
            Key: `upload/${fileKey}`,
            ResponseContentDisposition: `attachment; filename="${fileKey}"`
        })
        const preSignedUrl = await getSignedUrl(s3, preSignedUrlBuildCommand,{expiresIn: 60 * 60 * 24 });
        res.status(200).json({
            url: preSignedUrl
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}