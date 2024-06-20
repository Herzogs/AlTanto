export interface IRoadService<T> {
    getAllRoads () :Promise<T[]>;
    getRouteById (id: number): Promise<T>;
    createRoad (road: T): Promise<T>;
    getRoadsByUserId (id: string): Promise<T[]>;
}

