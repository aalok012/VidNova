 import mongoose, {Schema} from mongoose;
 import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
  
 
 
 const videoSchema = new Schema({
    videoFile: {
        type: String, // Use cloudinary URL
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    duration: {
        type: Number, // Use cloudinary URL
        required: true
    },
    views: {
        type: Number, // Use cloudinary URL
        default: 0
    },
    thumbnail: {
        type: String, // Use cloudinary URL
        required: true
    },
     title: {
        type: String, 
        required: true
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    Owner: {
        type: Schema.Types.objectId,
        Ref: "User"
    }

 },
    {
        timestamps: true
    }
);
videoSchema.plugin(mongooseAggregatePaginate)
 export const User = mongoose.model("User", videoSchema)