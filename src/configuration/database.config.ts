import * as fs from 'fs'

export default() =>({
    database :{
        type : 'postgres',
        host : process.env.DB_HOST,
        port : parseInt(process.env.DB_PORT!, 10) || 19041,
        username : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        name : process.env.DB_NAME,
        ssl: process.env.DB_SSL === 'verify-full'
      ? { ca: fs.readFileSync(process.env.DB_CA_CERT!).toString() }
      : (process.env.DB_SSL === 'require' ? { rejectUnauthorized: false } : false),
    }
})