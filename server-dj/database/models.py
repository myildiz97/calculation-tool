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
                validator={
                    '$jsonSchema': {
                        'bsonType': 'object',
                        'required': ['configName', 'admin', 'image', 'title', 'description', 'placeholder', 'variableName', 'outputName', 'outputValue', 'outputUnit', 'calculation'],
                        'properties': {
                            'configName': {
                                'bsonType': 'string',
                                'description': 'configName must be a string'
                            },
                            'admin': {
                                'bsonType': 'string',
                                'description': 'admin must be a string'
                            },
                            'image': {
                                'bsonType': 'array',
                                'description': 'image must be an array',
                                'items': {
                                    'bsonType': 'string',
                                    'description': 'sub image must be a string'
                                }
                            },
                            'title': {
                                'bsonType': 'array',
                                'description': 'title must be an array',
                                'items': {
                                    'bsonType': 'string',
                                    'description': 'sub title must be a string'
                                }
                            },
                            'description': {
                                'bsonType': 'array',
                                'description': 'description must be an array',
                                'items': {
                                    'bsonType': 'string',
                                    'description': 'sub description must be a string'
                                }
                            },
                            'placeholder': {
                                'bsonType': 'array',
                                'description': 'placeholder must be an array',
                                'items': {
                                    'bsonType': 'array',
                                    'description': 'sub placeholder must be an array',
                                }
                            },
                            'variableName': {
                                'bsonType': 'array',
                                'description': 'variableName must be an array',
                                'items': {
                                    'bsonType': 'array',
                                    'description': 'sub variableName must be an array',
                                }
                            },
                            'outputName': {
                                'bsonType': 'array',
                                'description': 'outputName must be an array',
                                'items': {
                                    'bsonType': 'string',
                                    'description': 'sub outputName must be an string',
                                }
                            },
                            'outputValue': {
                                'bsonType': 'array',
                                'description': 'outputValue must be an array',
                                'items': {
                                    'bsonType': 'string',
                                    'description': 'sub outputValue must be an string',
                                }
                            },
                            'outputUnit': {
                                'bsonType': 'array',
                                'description': 'outputUnit must be an array',
                                'items': {
                                    'bsonType': 'string',
                                    'description': 'sub outputUnit must be an string',
                                }
                            },
                            'calculation': {
                                'bsonType': 'array',
                                'description': 'calculation must be an array',
                                'items': {
                                    'bsonType': 'string',
                                    'description': 'sub calculation must be an string',
                                }
                            },
                        }
                    }
                }
            )

        self.collection = db['pages']
        # Create index
        self.collection.create_index("configName", unique=True)

    # Validate data
    def validate(self, page_data):
        if 'configName' not in page_data or not isinstance(page_data['configName'], str):
            return False, { "error": "Invalid configName" }
        if 'admin' not in page_data or not isinstance(page_data['admin'], str):
            return False, { "error": "Invalid admin" }
        
        docs = ['image', 'title', 'description', 'placeholder', 'variablename', 
                'outputname', 'outputvalue', 'outputunit', 'calculation']
        
        for doc in docs:
            if doc not in page_data or not isinstance(page_data[doc], list):
                return False, { "error": f"Invalid {doc}" }
            
        return True, None
    
    # CRUD

    def get(self, page_data, where="configName"):
        # Validate data
        is_valid, error = self.validate(page_data)

        # Get page
        if is_valid:
            try:
                # Get page
                page = self.collection.find_one({ where: page_data[where]})
                return True, page
            except:
                # Page not found
                return False, { "error": "Page not found" }
        else:
            # Invalid data
            return False, error
        
    def create(self, page_data):
        # Validate data
        is_valid, error = self.validate(page_data)

        # Create page
        if is_valid:
            try:
                # Insert page
                page_data['_id'] = self.collection.insert_one(page_data).inserted_id
                return True, page_data['_id']
            except DuplicateKeyError:
                # Page already exists
                return False, { "error": "Page already exists" }
        else:
            # Invalid data
            return False, error
        
    def update(self, page_data):
        # Validate data
        is_valid, error = self.validate(page_data)

        # Update page
        if is_valid:
            try:
                # Update page
                page_data['_id'] = self.collection.update_one({ "configName": page_data['configName'] }, { "$set": page_data })
                return True, page_data['_id']
            except DuplicateKeyError:
                # Page not updated
                return False, { "error": "Page not updated" }
        else:
            # Invalid data
            return False, error
        
    def delete(self, page_data):
        # Validate data
        is_valid, error = self.validate(page_data)

        # Delete page
        if is_valid:
            try:
                # Delete page
                page_data['_id'] = self.collection.delete_one({ "configName": page_data['configName'] })
                return True, page_data['_id']
            except DuplicateKeyError:
                # Page not deleted
                return False, { "error": "Page not deleted" }
        else:
            # Invalid data
            return False, error
        
    # Custom Serializer
        
    # Convert to dict
    def to_dict(self, instance):
        return {
            "configName": instance.get("configName"),
            "admin": instance.get("admin"),
            "images": instance.get("image"),
            "titles": instance.get("title"),
            "descriptions": instance.get("description"),
            "placeholders": instance.get("placeholder"),
            "variablenames": instance.get("variableName"),
            "outputnames": instance.get("outputName"),
            "outputvalues": instance.get("outputValue"),
            "outputunits": instance.get("outputUnit"),
            "calculations": instance.get("calculation"),
            "id": str(instance.get("_id")) if instance.get("_id") else None
        }
    
    # Convert from dict
    def from_dict(self, data_dict):
        page_data = {
            "configName": data_dict["configName"],
            "admin": data_dict["admin"],
            "images": data_dict["image"],
            "titles": data_dict["title"],
            "descriptions": data_dict["description"],
            "placeholders": data_dict["placeholder"],
            "variablenames": data_dict["variableName"],
            "outputnames": data_dict["outputName"],
            "outputvalues": data_dict["outputValue"],
            "outputunits": data_dict["outputUnit"],
            "calculations": data_dict["calculation"]
        }
        return page_data
