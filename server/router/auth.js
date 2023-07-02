const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Authenticate = require('../middleware/Authenticate')

require('../db/conn');
const User = require('../db/userSchema');
const Advertise = require('../db/advSchema');


// router.get('/', (req, res) => {
//     res.send("Hello from router");
// })


router.post('/register', (req, res) => {
    const { name, email, phone, password, cpassword, profileImage } = req.body;

    if (!name || !email || !phone || !password || !cpassword || !profileImage) {
        return res.status(422).json({ message: "pls fill the form" });
    }
    if (password != cpassword) {
        return res.status(423).json({ message: "password does not match" });
    }
    User.findOne({ phone: phone }).then(
        (userExist) => {
            if (userExist) {
                return res.status(424).json({ message: "user already exist" });
            }

            const user = new User({ name, email, phone, password, profileImage });

            user.save().then(() => {
                res.status(201).json({ message: "user registered successfully" })
            }).catch(err => { res.status(500).json({ message: "Password must have atleast 8 characters" }) })
        }
    ).catch(err => { console.log(err) });
})

router.post('/login', (req, res) => {
    const { phone, password } = req.body;
    if (!phone) {
        return res.status(424).json({ message: "empty username field" });
    }
    if (!password) {
        return res.status(423).json({ message: "empty password field" });
    }
    User.findOne({ phone: phone }).then(
        (userExist) => {
            bcrypt.compare(password, userExist.password, (err, result) => {
                if (result) {
                    userExist.generateAuthToken().then(function (token) {
                        res.cookie('jwtoken', token, {
                            expires: new Date(Date.now() + 86400000),
                            httpOnly: true
                        }).status(201).json({ message: "login successfully" });
                    });
                }
                else {
                    res.status(500).json({ message: "incorrect password" })
                }
            })
        }
    ).catch(err => { res.status(422).json({ message: "user does not exist" }); })
})

router.get('/getData', Authenticate, (req, res) => {
    res.status(200).send(req.rootUser);
})

router.get('/logout', Authenticate, (req, res) => {
    req.rootUser.tokens = req.rootUser.tokens.filter((item) => {
        return item.token !== req.token;
    })
    req.rootUser.save().then(() => { 
        res.status(200).clearCookie('jwtoken').send('User logged out') 
    });
})

router.post('/verify', Authenticate, (req, res) => {
    const { pass } = req.body;
    bcrypt.compare(pass, req.rootUser.password, (err, result) => {
        if (result) {
            res.status(200).send(req.rootUser);
        }
        else {
            res.status(500).json({ message: 'incorrect password' });
        }
    });
})

router.post('/editprofile', (req, res) => {
    const { _id, name, email, phone, profileImage } = req.body;
    User.findOne({ _id: _id }).then(
        (userExist) => {
            User.findOne({ phone: phone }).then((phoneExist) => {

                if (phoneExist && phoneExist.phone !== userExist.phone) {
                    res.status(501).json({ message: "phone number is already registered" });
                }
                else {
                    userExist.name = name;
                    userExist.email = email;
                    userExist.phone = phone;
                    userExist.profileImage = profileImage;

                    userExist.save().then(() => {
                        
                        res.status(201).json({ message: "profile updated" });
                        Advertise.find({user_id : userExist._id}).then((result)=>{
                            result.forEach((item) => {
                                item.phone = phone;
                            })
                            console.log(result);
                            // result.save().then(()=>{
                            // }).catch((error) => {
                            //     res.status(201).json({ message: "advertise not updated" });
                            // })
                        })

                    }).catch(error => { res.status(500).json({ message: "error updating" }) });

                }
            })
        })
        .catch(err => { console.log(err) });
})


router.post('/delete', Authenticate, (req, res) => {
    const { pass } = req.body;
    bcrypt.compare(pass, req.rootUser.password, (err, result) => {
        if (result) {
            User.findOneAndDelete({ _id: req.user_id }).then(() => {
                res.clearCookie('jwtoken', { path: '/' });
                res.status(200).json({ message: 'Account Deleted' });
            })
        }
        else {
            res.status(500).json({ message: 'incorrect password' });
        }
    });
})


router.post('/addpost', (req, res) => {
    const { title, category, description, AdvPhoto, name, user_id, phone, city } = req.body;
    const time=Date.now();
    if (!title || !category || !description || !AdvPhoto || !name || !user_id || !city) {
        return res.status(422).json({ message: 'fill the form' });
    }
    else {
        const advertise = new Advertise({ title, category, description, AdvPhoto, name, user_id, phone, city, time });
        advertise.save().then(() => {
            res.status(201).json({ message: "advertise posted successfully" });
        }).catch((err) => {
            res.status(500).json({ message: "error in posting advertise" });
        });

    }
})

router.get('/getadv', Authenticate, (req, res) => {
    Advertise.find({ user_id: req.rootUser._id }).then((result) => {
        if (result.length) {
            let i, j, temp;
            for (i = 0; i < result.length; i++) {
                for (j = 0; j < result.length - i - 1; j++) {
                    if (result[j].time < result[j + 1].time) {
                        temp = result[j];
                        result[j] = result[j + 1];
                        result[j + 1] = temp;
                    }
                }
            }
            res.status(200).send(result);
        }
        else {
            res.status(500).send({ message: 'no post available' });
        }
    })
})

router.post('/receive', (req, res) => {
    let { category, city, userID } = req.body;

    Advertise.find({ city: city, category: category }).then((result) => {
        result = result.filter((item) => {
            if (item.phone == userID) {

            }
            else {
                return item;
            }
        })
        if (result.length) {
            let i, j, temp;
            for (i = 0; i < result.length; i++) {
                for (j = 0; j < result.length - i - 1; j++) {
                    if (result[j].time < result[j + 1].time) {
                        temp = result[j];
                        result[j] = result[j + 1];
                        result[j + 1] = temp;
                    }
                }
            }
            res.status(200).send(result)
        }
        else {
            res.status(500).send({ message: 'no advertise found' });
        }
    })
})

router.post('/showInt', (req, res) => {
    const { userName, userID, advID } = req.body;
    Advertise.findOne({ _id: advID }).then((result) => {
        result.username = userName;
        result.save().then(() => {
            res.status(200).send({ message: 'saved request' })
        }).catch(err => {
            res.status(401).send({ message: 'request saving failed' })
        })
    }).catch(err => {
        res.status(500).send({ message: 'adv not found' })
    })
})


router.post('/getadvid', (req, res) => {
    const {AdvID} = req.body;
    Advertise.findOne({_id : AdvID}).then((result)=>{
        res.status(200).send(result);
    }).catch(err => {
        res.status(500).send({ message:'post not found'});
    })
})

router.post('/updatepost', (req, res) => {
    const {_id, title, category, description, AdvPhoto, city } = req.body;
    Advertise.findOne({_id : _id}).then((result)=>{
            result.title=title;
            result.category=category;
            result.description=description;
            result.AdvPhoto=AdvPhoto;
            result.city=city;
            result.time=Date.now();
            result.save().then(() => {
                res.status(201).json({ message: "post updated" });
            })
            .catch(error => { res.status(501).json({ message: "error updating" }) })

    }).catch(err => {
        res.status(500).send({ message:'post not found'});
    })
})

router.post('/deletepost', Authenticate, (req,res) => {
    const { pass, AdvID } = req.body;
    bcrypt.compare(pass, req.rootUser.password, (err, result) => {
        if (result) {
            Advertise.findOneAndDelete({ _id: AdvID }).then(() => {
                res.status(200).json({ message: 'Post Deleted' });
            })
        }
        else {
            res.status(500).json({ message: 'incorrect password' });
        }
    });
})


module.exports = router;