module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema(
    {
      username: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true,
        select: false
      },
      nickname: {
        type: String,
        required: true
      },
      avatar: {
        type: String,
        required: false,
        default: '/user.png'
      },
      __v: {
        type: Number,
        select: false
      }
    },
    { timestamps: true }
  )
  return mongoose.model('User', UserSchema)
}
