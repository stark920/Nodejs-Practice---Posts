const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '{PATH}: 請輸入姓名'],
      trim: true,
    },
    tags: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.toString() && v.length > 0;
        },
        message: '{PATH}: 請至少選擇一個標籤',
      },
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ['private', 'public'],
        message: '{PATH}: 請選擇私人(private)或公開(public)',
      },
      required: [true, '{PATH}: 請選擇私人(private)或公開(public)'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    content: {
      type: String,
      required: [true, '{PATH}: 請輸入內容'],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    collection: 'posts',
  }
);

const Posts = mongoose.model('posts', postSchema);

module.exports = Posts;
