const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: '../../.env' });

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    try {
      const uri = process.env.MONGODB_URI;
      
      if (!uri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
      }

      this.client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

      await this.client.connect();
      this.db = this.client.db('dashboard_app');
      
      console.log('Successfully connected to MongoDB Atlas!');
      
      // Test the connection
      await this.client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      
      return this.db;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not initialized. Call connect() first.');
    }
    return this.db;
  }

  async close() {
    try {
      if (this.client) {
        await this.client.close();
        console.log('MongoDB connection closed.');
      }
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      throw error;
    }
  }
}

module.exports = new Database();
