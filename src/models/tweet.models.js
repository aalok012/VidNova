import mongoose, {Schema} from mongoose;


const tweetSchema = new Schema({
    content:{
        type: string,
        required: true
    },
    owner:{
        type:Schema.Types.objectId,
        ref:"User"
    }
    
},{timestamps:true})
export const = mongoose.model("Tweet", "tweetSchema")