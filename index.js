require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')

//CUSTOM IMPORTS
const userRouter = require('./routes/User')
const invoiceRouter = require('./routes/Invoice')
const dashboardRouter = require('./routes/Dashboard')
const app = express()
const PORT = process.env.PORT || 4000

/* Connect with DB and then start server */
const startServer = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useCreateIndex : true,
            useFindAndModify: false /* https://mongoosejs.com/docs/deprecations.html#findandmodify */
        })
        console.log('MongoDB Connected...!')
        // start listening to port
        app.listen(PORT, () => console.log(`Server is up and running on the port ${PORT}`))
    }catch(error){
        console.log(`unable to connect with database \n ${error}`)
        startServer();
    }
}
startServer();


//Middleware
app.use(cors({
    origin : true,
    credentials : true
}))
app.use(express.json());

app.use(cookieParser());

app.use('/api/users',userRouter)
app.use('/api/invoice',invoiceRouter)
app.use('/api/dashboard',dashboardRouter)

app.get('/', (req,res) => {
    res.send('Invoice Application Server is up and running')
})