export interface DockerContainer {
    id: string;
    image: string;
    command: string;
    created: string;
    state: string;
    status: string;
    ports: string[];
    names: string[];
    sizeRootFs?: string;
}