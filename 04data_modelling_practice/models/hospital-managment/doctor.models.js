import mongoose from "mongoose"

const workedInHospitalsHoursSchema = new mongoose.Schema({
    hours: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
    }
})

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    experinceIn: {
        type: Number,
        required: true,
        default: 0
    },
    workedInHospitals: [workedInHospitalsHoursSchema,
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospital"
        }
    ]
}, { timestamps: true })


export const Doctor = mongoose.model("Doctor", doctorSchema)