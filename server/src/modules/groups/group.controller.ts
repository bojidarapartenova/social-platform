import { Request, Response } from "express";
import { GroupService } from "./group.service";

const groupService = new GroupService();

export async function createGroup(req: Request, res: Response) {
    try {
        const { name, description, avatarUrl } = req.body;
        const group = await groupService.createGroup(req.user!.userId, { name, description, avatarUrl });
        res.status(201).json(group);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getGroup(req: Request<{ id: string }>, res: Response) {
    try {
        const group = await groupService.getGroup(req.params.id, req.user?.userId);
        res.status(200).json(group);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}

export async function updateGroup(req: Request<{ id: string }>, res: Response) {
    try {
        const group = await groupService.updateGroup(req.params.id, req.user!.userId, req.body);
        res.status(200).json(group);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getMyGroups(req: Request, res: Response) {
    try {
        const groups = await groupService.getMyGroups(req.user!.userId);
        res.status(200).json(groups);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function requestToJoin(req: Request<{ id: string }>, res: Response) {
    try {
        await groupService.requestToJoin(req.params.id, req.user!.userId);
        res.status(200).json({ message: "Request sent" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getPendingRequests(req: Request<{ id: string }>, res: Response) {
    try {
        const requests = await groupService.getPendingRequests(req.params.id, req.user!.userId);
        res.status(200).json(requests);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getMembers(req: Request<{ id: string }>, res: Response) {
    try {
        const members = await groupService.getMembers(req.params.id);
        res.status(200).json(members);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function approveRequest(req: Request<{ id: string; userId: string }>, res: Response) {
    try {
        await groupService.approveRequest(req.params.id, req.params.userId, req.user!.userId);
        res.status(200).json({ message: "Approved" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function rejectRequest(req: Request<{ id: string; userId: string }>, res: Response) {
    try {
        await groupService.rejectRequest(req.params.id, req.params.userId, req.user!.userId);
        res.status(200).json({ message: "Rejected" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function kickMember(req: Request<{ id: string; userId: string }>, res: Response) {
    try {
        await groupService.kickMember(req.params.id, req.params.userId, req.user!.userId);
        res.status(200).json({ message: "Removed" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function leaveGroup(req: Request<{ id: string }>, res: Response) {
    try {
        await groupService.leaveGroup(req.params.id, req.user!.userId);
        res.status(200).json({ message: "Left group" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}