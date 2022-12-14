const request = require('supertest');
const { idText } = require('typescript');
const { response } = require('../app');
const app = require('../app');
const users = require('../routes/users');


app.use('/api/users',users);

describe('User Auth', ()=>{
         
    it('POST Successful login /api/users/login', async ()=>{
        const res = await request(app).post('/api/users/login').send({
            email:'james@gmail.com',
            password: '1234567'
        });
        expect(res.statusCode).toBe(200);
        console.log(res.headers);
        expect(res.headers["set-cookie"]).toBeDefined();
        expect(res.headers["set-cookie"]).toEqual(expect.objectContaining([
            expect.any(String)
        ]));
       
        expect(res.body).toEqual(
            expect.objectContaining({
                user:expect.any(String)
            })
        );
    });
    it('POST Empty password login failure /api/users/login', async ()=>{
        const res = await request(app).post('/api/users/login').send({
            email:'james@gmail.com',
            password: '123'
        });
        expect(res.statusCode).toBe(400);
    });

    it('POST Incorrect email syntax login /api/users/login', async ()=>{
        const {body,statusCode} = await request(app).post('/api/login').send({
            email:'james@gmail',
            password: '132546'
        });
        expect(statusCode).toBe(400);
    });
    it('POST User dose not exit login /api/users/login', async ()=>{
        const {body,statusCode} = await request(app).post('/api/login').send({
            email:'danile@gmail.com',
            password: '2345678'
        });
        expect(statusCode).toBe(401);
        expect(body).toEqual(
            expect.objectContaining({
                error:'Incorrect password or email'
            })
        );
    });
    it('POST Incorrect password login /api/users/login', async ()=>{
        const {body,statusCode} = await request(app).post('/api/login').send({
            email:'james@gmail.com',
            password: '132546'
        });
        expect(statusCode).toBe(401);
        expect(body).toEqual(
            expect.objectContaining({
                error:'User dose not exist'
            })
        );
    });

    
    it('POST Successful signup /api/users/signup', async ()=>{
        const {body,statusCode} = await request(app).post('/api/login').send({
            email:'mike@gmail.com',
            password:'123454657',
            name: 'james',
            surname:'brown',
            cell:'09876534',
            country:'libya'
        });
        expect(statusCode).toBe(201);
        expect(body.get("Set-Cookie")).toBeDefined();
        expect(body).toEqual(
            expect.objectContaining({
                user:expect.any(String)
            })
        );
    });
    it('POST incorrect fields failure signup /api/users/signup', async ()=>{
        const {body,statusCode} = await request(app).post('/api/login').send({
            email:'mike@gmail.com',
            password:'123454657',
            name: 'james',
        });
        expect(statusCode).toBe(400);
        expect(body).toEqual(
            expect.objectContaining({
                error:'missing fields'
            })
        );
       
    });

  

});


