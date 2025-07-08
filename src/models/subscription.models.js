import mongoose, {Schema} from "mongoose"
import { User } from "./user.models"

const subscriptionSchema = new Schema({
    Subscriber:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, //One who is subscribing
        ref:"User" 
       }
}, timestamps: true)



export const Subscription = mongoose.model("Subscription", subscriptionSchema)
