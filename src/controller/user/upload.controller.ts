import { Response } from "express";
import File from "../../models/file.model";
import { CustomRequest } from "../../types/common";
import User from "../../models/user.model";
import { Plan } from "../../types/schema";
import moment from "moment";

export const addFileLog = async (req: CustomRequest, res: Response) => {
    const { key, size, type, hasPassword, password ,transferLink,transferName,totalSubFiles} = req.body;

    if (!key || !size || !type) {
        return res.status(400).json({
            message: "All fields (key, size, type) are required.",
        });
    }

    try {
        const findDuplicate = await File.findOne({ key });
        if (findDuplicate) {
            return res.status(400).json({
                message: "A file with the same key already exists.",
            });
        }

        const user = await User.findById(req.user).exec();
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
            });
        }

        let fileExpiryTime = moment().add(user.plan === Plan.FREE ? 1 : 2, 'days');

        const createdFileLog = await File.create({
            key,
            size,
            type,
            transferLink,
            transferName,
            hasPassword,
            totalSubFiles,
            password,
            user: req.user,
            expiryDate: fileExpiryTime,
        });

        if (!createdFileLog) {
            throw new Error("Failed to create file log.");
        }

        return res.status(200).json({
            data: createdFileLog,
        });
    } catch (error) {
        console.error("Error adding file log:", error);
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};

export const deleteFileLogs = async (req: CustomRequest, res: Response) => {
    const { fileId } = req.params;
    if (!fileId) {
        return res.status(400).json({
            message: "fileId is required.",
        });
    }

    try {
        const deletedFile = await File.findByIdAndDelete(fileId).exec();
        if (!deletedFile) {
            return res.status(400).json({
                message: "Failed to delete file",
            });
        }

        return res.status(200).json({
            message: "File has been deleted",
        });
    } catch (error) {
        console.error("Error deleting file logs:", error);
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};

export const getAllFileLogs = async (req: CustomRequest, res: Response) => {
    try {
        const allFiles = await File.find({ user: req.user }).lean().exec();
        if (!allFiles.length) {
            return res.status(400).json({
                message: "No File Logs Available",
            });
        }

        res.status(200).json({
            data: allFiles,
        });
    } catch (error) {
        console.error("Error fetching all file logs:", error);
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};

export const getFileLog = async (req: CustomRequest, res: Response) => {
    const { fileId } = req.params;
    if (!fileId) {
        return res.status(400).json({
            message: "fileId is required.",
        });
    }

    try {
        const foundFile = await File.findById(fileId).exec();
        if (!foundFile) {
            return res.status(404).json({
                message: "No File with this id exists",
            });
        }

        res.status(200).json({
            data: foundFile,
        });
    } catch (error) {
        console.error("Error fetching file log:", error);
        return res.status(500).json({
            message: "Internal server error.",
        });
    }
};
