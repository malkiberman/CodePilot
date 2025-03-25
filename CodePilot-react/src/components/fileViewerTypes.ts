export interface Version {
    versionId: number;
    filePath: string;
}

export interface FileData {
    id: number;
    name: string;
    filePath: string;
    versions: Version[];
}