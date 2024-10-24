import mongoose from 'mongoose'
import express from 'express'

const app = express();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}
connectDB();


app.get('/', (req, res) => {
  res.send('Hello World!')
})

import questionController from './controller/question.js' // Importing the second controller

app.use('/questions', questionController)



app.listen(3000, () => {
  console.log('Listening on port 3000')
})


