const express = require('express');

module.exports = (options = {}) => {
    const router = express.Router();

    const {service} = options;

    router.get('/greet',(req,res)=>{
        res.send(service.createGreeting(req.query.name || 'Stranger'));
    });

    return router;
};