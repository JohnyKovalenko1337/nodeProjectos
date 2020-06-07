const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema ({
    title:{ 
        type:String,
        requered: true,
    },
    price:{
        type:Number,
        requered: true,
    },
    description:{
        type:String,
        requered: true,
    },
    imageUrl:{
        type:String,
        requered: true,
    },
})

module.exports = mongoose.model('Product',productSchema);
/* class Product {
    constructor(title, price, description, imageUrl, id,userId){
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id): null;
        this.userId=userId;
    }

    save(){
        const db = getDb();
        let dbOp;
        if(this._id){
            //Update product
            dbOp = db.collection('products')
            .updateOne({_id : this._id}, {$set: this});
        }
        else{
            dbOp = db.collection('products').insertOne(this);    
        }
        return dbOp.then(res=>{
            console.log("Product.js :");
            console.log(res);
        })
        .catch(err=>{
            console.log(err);
        });
    };
    // fetch-all method which find all the elements in collection and 
    // implement them to js array 
    static fetchAll(){
        const db = getDb();
        return db.collection('products').find()
        .toArray()
        .then(products =>{
            console.log(products);
            return products;
        })
        .catch(err=> 
            {console.log(err);
        });
    }
    
    static findById(prodId){
        const db = getDb();
        return db.collection('products').find({_id : new mongodb.ObjectId(prodId)}) //mongodb store id like an object
        .next()
        .then(product =>{
            console.log(product);
            return product;
        })
        .catch(err=>{
            console.log(err);
        })
    }
    static deleteById(prodId){
        const db = getDb();
        return db.collection('products')
        .deleteOne({_id : new mongodb.ObjectId(prodId)})
        .then(()=>{
            console.log("deleted");
        })
        .catch(err =>{ console.log(err);
        })
    }
}

module.exports = Product; */