export interface Admin{
    id:number,
    username:string,
    password:string,
    admin_table:string,
    local_id:number,
    active:boolean,
    admin:boolean,
    root:boolean
}