from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv, find_dotenv
import os

def connect_to_mongodb():
    load_dotenv(find_dotenv())
    uri = os.environ.get("MONGODB_URL")
    
    if not uri:
        print("MONGODB_URL not found in environment variables. Connection aborted.")
        return None

    # Create a new client and connect to the server
    try:
        client = MongoClient(uri)
        client.admin.command('ping')  # Send a ping to confirm a successful connection
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        return None