import { Request, Response } from "express";
import { ChatService } from "./chat.service";

const chatService = new ChatService();

export async function startConversation(req: Request<{ userId: string }>, res: Response) {
    try {
        const conversation = await chatService.startConversation(req.user!.userId, req.params.userId);
        res.status(200).json(conversation);
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getConversations(req: Request, res: Response) {
    try {
        const conversations = await chatService.getConversations(req.user!.userId);
        res.status(200).json(conversations);
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getMessages(req: Request<{ conversationId: string }>, res: Response) {
    try {
        const messages = await chatService.getMessages(req.params.conversationId, req.user!.userId);
        res.status(200).json(messages);
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function sendMessage(req: Request<{ conversationId: string }>, res: Response) {
    try {
        const message = await chatService.sendMessage(req.params.conversationId, req.user!.userId, req.body.text);
        res.status(201).json(message);
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getUnreadCount(req: Request, res: Response) {
    try {
        const count = await chatService.getTotalUnread(req.user!.userId);
        res.status(200).json({ count });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}