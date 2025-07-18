import mongoose, {Schema} from mongoose;
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
 

const commentSchema = new Schema({
    content:{
        type:String,
        required: true,
    },
    video:{
        type:Schema.Types.objectId,
        ref:"Video"
    },
    owner:{
        type:Schema.Types.objectId,
        ref:"User"
    }

},{timestamps:true})

commentSchema.plugin(mongooseAggregatePaginate)

export const comment = mongoose.model("comment", commentSchema)