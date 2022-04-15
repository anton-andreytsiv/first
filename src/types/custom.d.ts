declare namespace Express{
    export interface Request {
        user_id: int;
        role: string;
    }
}
declare namespace jsonwebtoken {
    export interface JwtPayload {
        email: string;
    }
}

