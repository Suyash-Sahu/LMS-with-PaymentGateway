import mongoose from "mongoose";

const MAX_RETRIES = 3
const RETRY_INTERVAL = 5000

class DatabaseConnection {
    constructor() {
        this.retrycount = 0
        this.isConnected = false

        // configure mongoose setting
        mongoose.set("strictQuery", true);

        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected successfully")
            this.isConnected = true
        })

        mongoose.connection.on("error", () => {
            console.log("MongoDB connection error")
            this.isConnected = false

        })

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected")
            this.handleDisconnection()
        })

        process.on('SIGTERM',this.handleAppTermination.bind(this))

    }

    async connect() {
        try {
            if (!process.env.MongoDB_URI) {
            throw new Error("MONGO DB URI is not defined in env variables")
        }

        const connectionOption = {
            useNewUrlParse: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4
        }

        if (process.env.NODE_ENV === "development") {
            mongoose.set('debug', true)
        }

        await mongoose.connect(process.env.MongoDB_URI, connectionOption)
        this.retryCount = 0
        } catch (error) {
            console.error(error.message)
            await this.handleConnectionError
        }
    }

    async handleConnectionError(){
        if(this.retryCount<MAX_RETRIES){
            this.retryCount++;
            console.log(`Retrying connection... Attemp ${this.retryCount} of ${MAX_RETRIES}`)
            await new Promise(resolve=>setTimeout(()=>{
                resolve
            },RETRY_INTERVAL))
            return this.connect()
        }else{
            console.error(`Failed to connect to mongodb after ${MAX_RETRIES} attempts`)
            process.exit(1)
        }
    }

    async handleDisconnection(){
        if(!this.isConnected){
            console.log("Attempting to reconnected to mongodb...")
            this.connect()
        }
    }

    async handleAppTermination(){
        try {
            await mongoose.connection.close()
            console.log("MONGODB connection closed through app termination")
            process.exit(0)
        } catch (error) {
            console.error("error during database disconnection",error)
            process.exit(1)
        }
    }

    getConnectionStatus(){
        return{
            isConnected:this.isConnected,
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name,
        }
    }
}

const dbConnection = new DatabaseConnection();

export default dbConnection.connect.bind(dbConnection)
export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection);