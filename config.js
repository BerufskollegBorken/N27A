var config = {
    development: {        
        url: 'localhost:3000',        
        database: {
            host:   '10.40.38.110',
            port:   '3306',
            user: 'placematman',
            db:     'dbn27',
            password: 'BKB123456!'
        },        
        server: {
            host: 'localhost',
            port: '3000'
        }
    },
    production: {        
        url: 'http://n27.herokuapp.com/',        
        database: {
            host: '130.255.124.99',
            port: '3306',
            user: 'placematman',
            db:     'dbn27',
            password: 'BKB123456!'
        },
        //server details
        server: {
            host:   'http://n27.herokuapp.com/',
            port:   '80'
        }
    }
    };
    module.exports = config;