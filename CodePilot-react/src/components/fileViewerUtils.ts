import { diffLines } from "diff";
import { message } from "antd";
import { Version } from './fileViewerTypes'; // ייבוא האינטרפייס


export const fetchFileById = async (fileId: number) => {
    const response = await fetch(`${API_BASE_URL}/files/${fileId}`);
    if (!response.ok) {
        message.error("שגיאה בטעינת פרטי הקובץ");
        throw new Error("שגיאה בטעינת פרטי הקובץ");
    }
    return response.json();
};

export const fetchFileVersions = async (fileId: number) => {
    const response = await fetch(`${API_BASE_URL}/files/${fileId}/versions`);
    if (!response.ok) {
        message.error("שגיאה בטעינת גרסאות הקובץ");
        throw new Error("שגיאה בטעינת גרסאות הקובץ");
    }
    return response.json();
};

export const fetchVersionContentByPath = async (filePath: string): Promise<string> => {
    console.log("fetchVersionContentByPath: מתחיל הורדה מ:", filePath);
    const response = await fetch(filePath);
    console.log("fetchVersionContentByPath: סטטוס תגובה:", response.status);
    if (!response.ok) {
        message.error("לא ניתן להוריד את תוכן הגרסה");
        console.error("fetchVersionContentByPath: שגיאה בהורדת הגרסה", response.status);
        throw new Error("לא ניתן להוריד את תוכן הגרסה");
    }
    const text = await response.text();
    console.log("fetchVersionContentByPath: תוכן הגרסה הוטען (חלקית):", text.substring(0, 100) + "...");
    return text;
};

export const compareTwoContents = (content1: string, content2: string) => {
    return diffLines(content1, content2);
};