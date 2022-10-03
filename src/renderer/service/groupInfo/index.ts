import { GroupInfo } from "../../pages/GroupInfo";

export interface GroupInfoService {
    getGroupInfo(): Promise<GroupInfo>;
    setGroupInfo(groupInfo: Partial<GroupInfo>): Promise<void>;
}

export class LocalGroupInfoService implements GroupInfoService {

    getGroupInfo(): Promise<GroupInfo> {

        const groupInfo = JSON.parse(localStorage.getItem("groupInfo") || "null");

        return Promise.resolve(groupInfo);
    }

    setGroupInfo(groupInfo: Partial<GroupInfo>): Promise<void> {

        this.getGroupInfo().then(group => {
            const newGroupInfo = { ...group, ...groupInfo };
            localStorage.setItem('groupInfo', JSON.stringify(newGroupInfo));
        });

        return Promise.resolve();
    }
}

export function getGroupInfoService(): GroupInfoService {
    return new LocalGroupInfoService();
}