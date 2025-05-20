import mongoose  from "mongoose";

const connectDB =async () => {
    try {
        await mongoose.connect(process.env.MANGO_URL)
        console.log("MonogoDB Connecetd")
    } catch(error) {
        console.log("DB Eroor")
    }
}

export default connectDB