import { compare, hash } from "bcryptjs";

export class User {
    private _password: string;

    constructor(private readonly _name:string, private readonly _email: string, passHash?:string){ 
        if(passHash){
            this._password = passHash;
     }}

    get email(): string {
        return this._email;
    }

    get name(): string {
        return this._name;
    }

    get password(): string {
        return this._password
    }

    public async setPassword(pass:string, salt: string): Promise<void> {
        this._password = await hash(pass, Number(salt));
    }

    public async comparePassword(pass:string): Promise<boolean> {
        return await compare(pass, this._password);
    }


}