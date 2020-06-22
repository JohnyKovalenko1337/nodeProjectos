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
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Product',productSchema);
