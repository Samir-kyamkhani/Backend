import mongoose from "mongoose"

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["MALE", "FEMALE"]
    },
    bloodGroup: {
        type: String,
    },
    address: {
        type: String,
        required: true
    },
    daigonosedWith: {
        type: String,
        required: true
    },
    admitedIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    },
}, {timestamps: true})


export const Patient = mongoose.model("Patient", patientSchema)