const express = require('express');

const app = express();

const port = 3000;

let products = [
    {
        name : 'p1',
        desc : 'abc',
        type : 'mobile',
        price: 100
    },
    {
        name : 'p2',
        desc : 'jb',
        type : 'laptop',
        price: 300
    },
    {
        name : 'p3',
        desc : 'sfb',
        type : 'tv',
        price: 400
    }
];

const filter = (type) => {
    const filterProducts = [];
    if(type === 'mobile'){
        products.forEach((prod, index)=>{
            if(prod.type==='mobile'){
                const temp = {
                    name : prod.name,
                    desc : prod.desc,
                    type : prod.type,
                    price: prod.price
                }
                filterProducts.push(temp);
            }
        });
    }else if(type === 'laptop'){
        products.forEach((prod, index)=>{
            if(prod.type==='laptop'){
                const temp = {
                    name : prod.name,
                    desc : prod.desc,
                    type : prod.type,
                    price: prod.price
                }
                filterProducts.push(temp);
            }
        });
    }else{
        products.forEach((prod, index)=>{
            if(prod.type !=='mobile' && prod.type !=='laptop'){
                const temp = {
                    name : prod.name,
                    desc : prod.desc,
                    type : prod.type,
                    price: prod.price
                }
                filterProducts.push(temp);
            }
        });
    }
    return filterProducts;
};

const sortProducts = (sort) => {
    let sortedProducts = products;
    if(sort === 'asc'){
        sortedProducts.sort((a,b) => {
            return a.price-b.price;
        });
    } else if(sort == 'desc'){
        sortedProducts.sort((a,b) => {
            return b.price-a.price;
        });
    }
    return sortedProducts;
};

app.get('/api/get',(req,res) => {
    const type = req.query.type;
    const sort = req.query.type;
    if(type){
        const filterProducts = filter(type);
        res.send(filterProducts);
    }
    if(sort){
        const sortedProducts = sortProducts(sort);
        res.send(sortedProducts);
    }
    
});

app.put('/api/update/:id',(req,res) => {
    res.send('Update is working');
});

app.delete('/api/delete/:id',(req,res) => {
    res.send('delete is working');
});

app.listen(port);