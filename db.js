var mysql=require('mysql2');
var util=require('util');

var conn=mysql.createConnection({
    host:'b72hbsxzirvqq8peyfno-mysql.services.clever-cloud.com',
    user:'ujin5afs4gipyxtv',
    password:'ujin5afs4gipyxtv',
    database:'b72hbsxzirvqq8peyfno'
});

var exe=util.promisify(conn.query).bind(conn);

module.exports=exe;
