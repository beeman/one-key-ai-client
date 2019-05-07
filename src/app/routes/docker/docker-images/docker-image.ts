export interface DockerImage {
    repository: string;
    tag: string;
    id: string;
    created: string;
    size: string;
    containers?: number;
}