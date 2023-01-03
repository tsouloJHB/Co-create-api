const request = require('supertest');
const { idText } = require('typescript');
const { response } = require('../app');
const app = require('../app');
const users = require('../routes/users');
const User = require("../modules/user");
const jwt = require('jsonwebtoken');



app.use('/api/users',users);

describe('User Auth', ()=>{
    let id = "";
    let user = "";
    const email = "steve@gmail.com";
    const password = "1234567";
    const name = "steve";
    let token = "";     
    beforeAll(async () => {
    
        user = await User.create({email,password,name});
        id = user._id;
       
      });

    afterAll(async () =>  {
         await User.findByIdAndDelete(id);    
    });



    it('POST Successful login /api/users/login', async ()=>{
        const res = await request(app).post('/api/users/login').send({
            email:email,
            password: password
        });
        expect(res.statusCode).toBe(200);
        console.log(res.headers);
        expect(res.headers["set-cookie"]).toBeDefined();
        expect(res.headers["set-cookie"]).toEqual(expect.objectContaining([
            expect.any(String)
        ]));
        console.log(res.body.token);
        //set the token for the other tests
        token = res.body.token;
        expect(res.body).toEqual(
            expect.objectContaining({
                user:expect.any(String)
            })
        );
    });

    it('POST Incorrect password login failure /api/users/login', async ()=>{
        const res = await request(app).post('/api/users/login').send({
            email:email,
            password: '123'
        });
        expect(res.statusCode).toBe(400);
    });

    it('POST Incorrect email syntax login /api/users/login', async ()=>{
         const res = await request(app).post('/api/users/login').send({
            email:'james@dfg',
            password: '1234567'
        });
        console.log(res.body);
        expect(res.body).toEqual(
            expect.objectContaining({
                errors:{
                    email:"Incorrect email",
                    password:"",
                }
            })
        );
        expect(res.statusCode).toBe(400);
    });
    it('POST User dose not exit login /api/users/login', async ()=>{
        const {body,statusCode} = await request(app).post('/api/users/login').send({
            email:'danile@gmail.com',
            password: '2345678'
        });
        expect(statusCode).toBe(400);
        expect(body).toEqual(
            expect.objectContaining({
                errors:{
                    email:"Incorrect email",
                    password:"",
                }
            })
        );
    });
    it('POST Incorrect password login /api/users/login', async ()=>{
        const {body,statusCode} = await request(app).post('/api/users/login').send({
            email:email,
            password: '132546'
        });
        expect(statusCode).toBe(400);
        expect(body).toEqual(
            expect.objectContaining({
                errors:{
                    email:"",
                    password:"Incorrect password",
                }
            })
        );
    });

    
    it('POST Successful signup /api/users/signup', async ()=>{
        const res = await request(app).post('/api/users/signup').send({
            email:'lebo@gmail.com',
            password:'123454657',
            name: 'lebo',
        });
       
        expect(res.statusCode).toBe(201)
        const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
        try{
            await User.findByIdAndDelete(decoded.id);
        }catch (err){
            console.log(err);
            fail('Problem deleting entry');
        }
        
        expect(res.headers["set-cookie"]).toBeDefined();
        expect(res.body).toEqual(
            expect.objectContaining({
                user:expect.any(String)
            })
        );
       

    });
    it('POST incorrect fields failure signup /api/users/signup', async ()=>{
        const {body,statusCode} = await request(app).post('/api/users/signup').send({
            email:'mike@gmail.com',
            password:'123454657',
          
        });
        expect(statusCode).toBe(400);
        expect(body).toEqual(
            expect.objectContaining({
                errors:{
                    email:"",
                    password:"",
                    name: "Please enter a name",
                }
            })
        );
    });

    //update Values
    it('PUT update user profile' , async ()=>{
        const res = await request(app).post('/api/users/update').send({
            name:"dave",
            surname: "beak",
            country:"bali",
            desc:"I am a downloader",
            city:"moon",
            occupation:"doctor",
            cell:"09876754",
            countryCode:"27",
            skills:"dp"
        }).set(
            {Authorization: `Bearer ${token}`}
        );


        expect(res.statusCode).toBe(201);
        // expect(res.headers["set-cookie"]).toBeDefined();
        // expect(res.headers["set-cookie"]).toEqual(expect.objectContaining([
        //     expect.any(String)
        // ]));
       
        expect(res.body).toEqual(
            expect.objectContaining({
                name:"dave",
                surname: "beak",
                country:"bali",
                desc:"I am a downloader",
                city:"moon",
                occupation:"doctor",
                cell:"09876754",
                countryCode:"27",
                skills:"dp"
            })
        );
    });

    it('PUT partial user update' , async ()=>{
        const res = await request(app).post('/api/users/update').send({
            name:"john",
            desc:"John the developer",
        }).set(
            'Authorization', `Bearer ${token}`
        );
// set( 'Authorization' ,  `Bearer ${token}); 
// {Authorization: `Bearer ${token}`}
        expect(res.statusCode).toBe(201);

        // expect(res.headers["set-cookie"]).toBeDefined();
        // expect(res.headers["set-cookie"]).toEqual(expect.objectContaining([
        //     expect.any(String)
        // ]));
       
        expect(res.body).toEqual(
            expect.objectContaining({
                name:"john",
                desc:"John the developer",
            })
        );
    });

    //Update password
    it('PUT update user password', async ()=>{
        const res = await request(app).post('/api/users/updatepassword').send({
            password:"password"
    }).set({
        Authorization: `Bearer ${token}`
    })

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
            expect.objectContaining({
                response:"Password updated"
            })
        );


    });

    //incorrect token 
    it('PUT incorrect token', async()=>{
        const res = await request(app).post('/api/users/updatepassword').send({
            password:"12343567"
        }).set({
            Authorization : `Bearer 122fvdfg5r6gfg`
        })
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(
            expect.objectContaining({
                response:"Authentication failure"
            })
        );
    });
  

});


