export default() =>({
    database :{
        type : 'postgres',
        host : process.env.DB_HOST || 'localhost',
        post : process.env.DB_PORT || 5432,
        username : process.env.DB_USERNAME,
        password : process.env.DB_PASSWORD,
        name : process.env.DB_NAME,
        ssl : process.env.DB_SSL || false
    }
})