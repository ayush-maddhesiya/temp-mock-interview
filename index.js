// import mongoose from 'mongoose'

// const uri="mongodb+srv://ayush:ayush123@cluster0.9h4qgcg.mongodb.net/mock"
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     })
//     console.log(`MongoDB Connected: ${conn.connection.host}`)
//   } catch (error) {
//     console.error(`Error: ${error.message}`)
//     process.exit(1)
//   }
// }
// connectDB();


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// import {getUser, registerUser, createQuestion} from "./route/route.js"

// app.use(express.json())

// app.use('/user', registerUser)
// app.use('/user', getUser)
// app.use('/question', createQuestion)


// app.listen(3000, () => {
//   console.log('Listening on port 3000')
// })


import mongoose from 'mongoose'
import express from 'express'
import router from './route/route.js'

const app = express();
app.use(express.json())

const uri = "mongodb+srv://ayush:ayush123@cluster0.9h4qgcg.mongodb.net/mock"
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri, {
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

// Use the router instead of individual route handlers
app.use('/', router)

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
