from .constants import user_roles
from pymongo.errors import DuplicateKeyError
import bcrypt
import datetime

class User:
    def __init__(self, db):
        # Set collection name
        self.collection_name = 'users'
        # Set database
        self.db = db
        # Create collection
        if self.collection_name in self.db.list_collection_names():
            self.collection = self.db[self.collection_name]
        else:
            self.collection = self.db.create_collection(
                self.collection_name,
                validator={
                    '$jsonSchema': {
                        'bsonType': 'object',
                        'required': ['fullName', 'email', 'password', 'role'],
                        'properties': {
                            'fullName': {
                                'bsonType': 'string',
                                'description': 'fullName must be a string'
                            },
                            'email': {
                                'bsonType': 'string',
                                'pattern': '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
                                'description': 'email must be a valid email format'
                            },
                            'password': {
                                'bsonType': 'string',
                                'minLength': 8,
                                'description': 'password must be a string and longer than 8 characters'
                            },
                            'role': {
                                'enum': user_roles,
                                'description': 'role must be one of the following: ["Customer", "Admin"]'
                            },
                        }
                    }
                }
            )

        self.collection.create_index("email", unique=True)


    # CRUD

    # Get user
    def get(self, user_data, where="email"):
        try:
            user = self.collection.find_one({where: user_data[where]})
            if user:
                return True, user
            return False, { "error": "No registered user with given email!" }
        except Exception as e:
            return False, { "error": str(e) }

    # Create user
    def create(self, user_data):
        try:
            # Hash password
            user_data['password'] = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user_data['created_at'] = datetime.datetime.now()
            user_data['updated_at'] = datetime.datetime.now()

            # Insert user
            user_data['_id'] = self.collection.insert_one(user_data).inserted_id
            return True, user_data['_id']
        except DuplicateKeyError:
            return False, { "error": "Email already exists" }
        except Exception as e:
            return False, { "error": str(e) }

    # Update user    
    def update(self, user_data):
        try:
            # Hash password
            user_data['password'] = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user_data['updated_at'] = datetime.datetime.now()

            # Update user
            self.collection.update_one({ "email": user_data['email'] }, { "$set": user_data })
            return True, user_data['_id']
        except DuplicateKeyError:
            return False, { "error": "Email already exists" }
        except Exception as e:
            return False, { "error": str(e) }

    # Delete user
    def delete(self, user_data):
        try:
            self.collection.delete_one({ "email": user_data['email'] })
            return True, user_data['_id']
        except Exception as e:
            return False, { "error": str(e) }
        
           # Custom Serializer

    # Convert to dict    
    def to_dict(self, instance, token=None):
        return {
            "fullName": instance.get("fullName"),
            "email": instance.get("email"),
            "role": instance.get("role"),
            "token": token,
            "id": str(instance.get("_id")) if instance.get("_id") else None
        }
    
    # Convert from dict
    def from_dict(self, data_dict, is_full=True):
        user_data = {}

        if is_full:
            user_data = {
                "fullName": data_dict["fullName"],
                "role": data_dict.get("role", user_roles[1])
            }

        user_data["email"] = data_dict["email"]
        user_data["password"] = data_dict["password"]
        return user_data

class Page:
    def __init__(self, db):
        # Set collection name
        self.collection_name = 'pages'
        # Set database
        self.db = db
        # Create collection
        if self.collection_name in self.db.list_collection_names():
            self.collection = self.db[self.collection_name]
        else:
            self.collection = self.db.create_collection(
                self.collection_name,
                validator = {
                    '$jsonSchema': {
                        'bsonType': 'object',
                        'properties': {
                            'configName': {
                                'bsonType': 'string',
                                'description': 'configName must be a string'
                            },
                            'image': {
                                'bsonType': ['array', 'string'],
                                'description': 'image must be an array of strings'
                            },
                            'title': {
                                'bsonType': ['array', 'string'],
                                'description': 'title must be an array of strings'
                            },
                            'description': {
                                'bsonType': ['array', 'string'],
                                'description': 'description must be an array of strings'
                            },
                            'placeholder': {
                                'bsonType': ['array', 'string'],
                                'description': 'placeholder must be an array'
                            },
                            'variableName': {
                                'bsonType': ['array', 'string'],
                                'description': 'variableName must be an array',
                            },
                            'outputName': {
                                'bsonType': ['array', 'string'],
                                'description': 'outputName must be an array of strings',
                            },
                            'outputValue': {
                                'bsonType': ['array', 'string'],
                                'description': 'outputValue must be an array of strings',
                            },
                            'outputUnit': {
                                'bsonType': ['array', 'string'],
                                'description': 'outputUnit must be an array of strings',
                            },
                            'calculation': {
                                'bsonType': ['array', 'string'],
                                'description': 'calculation must be an array of strings',
                            },
                            'admin': {
                                'bsonType': 'string',
                                'description': 'admin must be a string'
                            }
                        }
                    }
                }
            )

        # Create index
        self.collection.create_index("configName", unique=True)
    
    # CRUD

    # Get page
    def get(self, page_data, where="configName"):
        try:
            page = self.collection.find_one({ where: page_data[where]})
            if page:
                return True, page
            return False, { "error": "Page not found!" }
        except Exception as e:
            return False, { "error": str(e) }
                
    def create(self, page_data):
        # Create page
        try:
            # Insert page
            page_data['_id'] = self.collection.insert_one(page_data).inserted_id
            if page_data['_id'] is None:
                return False, { "error": "Page not created" }
            return True, { "_id": str(page_data['_id']) }
        except DuplicateKeyError:
            # Page already exists
            return False, { "error": "Page already exists" }
        
    def update(self, page_data):
        try:
            # Update page
            page_data['_id'] = self.collection.update_one({ "configName": page_data['configName'] }, { "$set": page_data })
            if page_data['_id'] is None:
                return False, { "error": "Page not updated" }
            return True, page_data['_id']
        except Exception as e:
            return False, { "error": str(e) }

    def delete(self, page_data):
        # Delete page
        try:
            # Delete page
            page_data['_id'] = self.collection.delete_one({ "configName": page_data['configName'] })
            if page_data['_id'] is None:
                return False, { "error": "Page not deleted" }
            return True, page_data['_id']
        except Exception as e:
            return False, { "error": str(e) }
        
    # Custom Serializer
        
    # Convert to dict
    def to_dict(self, instance):
        return {
            "configName": instance.get("configName"),
            "admin": instance.get("admin"),
            "image": instance.get("image"),
            "title": instance.get("title"),
            "description": instance.get("description"),
            "placeholder": instance.get("placeholder"),
            "variableName": instance.get("variableName"),
            "outputName": instance.get("outputName"),
            "outputValue": instance.get("outputValue"),
            "outputUnit": instance.get("outputUnit"),
            "calculation": instance.get("calculation"),
            "id": str(instance.get("_id")) if instance.get("_id") else None
        }
    
    # Convert from dict 
    def from_dict(self, data_dict):
        page_data = {
            "configName": data_dict["configName"],
            "admin": data_dict["admin"],
            "image": data_dict["image"],
            "title": data_dict.getlist("title"),
            "description": data_dict.getlist("description"),
            "placeholder": [[', '.join(i) for i in [item.split(',') for item in data_dict.getlist("placeholder", [])]]],
            "variableName": [[', '.join(i) for i in [item.split(',') for item in data_dict.getlist("variableName", [])]]],
            "outputName": data_dict.getlist("outputName"),
            "outputValue": data_dict.getlist("outputValue"),
            "outputUnit": data_dict.getlist("outputUnit"),
            "calculation": data_dict.getlist("calculation")
        }
        return page_data

