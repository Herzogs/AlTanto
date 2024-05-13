import {Dialect} from "sequelize";

declare global{
    namespace NodeJS{
        interface ProcessEnv{
            PORT:string
            DB_PORT:string
            DB_USER:string
            DB_PASSWORD:string
            DB_HOST:string
            BD_NAME_DATABASE:string
            DB_DIALECT:  Dialect
        }
    }
}
export {}