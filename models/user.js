const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    cart:{
        items:[{
            productId:{
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity:{
                type: Number,
                required: true
            }
    }]
    }
});
// <------------------adding new method addToCart to our schema----------------------->
userSchema.methods.addToCart = function(product){      // it is important to be written like that
    const CartProductIndex = this.cart.items.findIndex(cp=>{
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [ ...this.cart.items];
    if(CartProductIndex >= 0){
        newQuantity = this.cart.items[CartProductIndex].quantity + 1;
        updatedCartItems[CartProductIndex].quantity = newQuantity;
    }
    else{
        updatedCartItems.push({productId : product._id,quantity:newQuantity});
    }
    
    const updatedCart = { items: updatedCartItems} ;
    
    this.cart = updatedCart;

    return this.save();
} ;
// <===============adding new method deleteItemFromCart to our schema=========>

userSchema.methods.deleteItemFromCart = function(productId){
    const updatedCartItems = this.cart.items.filter(item=>{
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}
// <===============adding new method clearCart to our schema=========>
userSchema.methods.clearCart = function(){
    this.cart = {items: []};
    return this.save();
}

module.exports= mongoose.model('User', userSchema);
/*


    addOrder(){
        const db = getDb();
        return this.getCart()
        .then( products=>{
            const order = {
                items: products,
                user:{ _id: new mongodb.ObjectId(this._id),
                        name: this.name
                }
            }
            return db
            .collection('orders')
            .insertOne(order)
        })
        .then(result=>{
            this.cart = {items : []};
            return db
            .collection('users')
            .updateOne(
            {_id:new mongodb.ObjectId(this._id)},
            {$set: {cart: {items: []}}})
        })
    }

    getOrders(){
        const db = getDb();
        return db.collection('orders')
        .find({'user._id': new mongodb.ObjectId(this._id)})
        .toArray();
    }
    static findById(userId){
        const db = getDb();
        return db.collection('users')
        .findOne({_id : new mongodb.ObjectId(userId)}).then().catch(err=>{console.log(err);});
    }
 */