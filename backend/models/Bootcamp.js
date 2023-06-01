import mongoose from "mongoose";


const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Provide a name for the bootcamp'],
        unique: true
    },
    rating: {
        type: Number,
        required: [true, 'Please Provide a rating for the bootcamp']
    },
    description: {
        type: String,
        required: [true, 'Please Provide a description for the bootcamp']
    },
    price: {
        type: Number,
        required: [true, 'Please Provide a price for the bootcamp']
    }
});

const Bootcamp = mongoose.model('Bootcamp', BootcampSchema);

export default Bootcamp;