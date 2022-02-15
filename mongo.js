const mongoose = require('mongoose')

module.exports = async () => {

    const username = process.env.USER_NAME
    const password = process.env.PASSWORD
    const cluster = process.env.CLUSTER
    const dbname = process.env.DB_NAME
    const url = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`
    const mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

    await mongoose.connect(url, mongooseOptions)
    .then(x => console.log(`Connected to MongoDB : ${x.connections[0].name}`))
    .catch(err => console.error('Error connecting to mongo', err))
}