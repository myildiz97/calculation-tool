from .constants import user_roles
from pymongo.errors import DuplicateKeyError
import bcrypt
import json
from datetime import date, datetime
from bson import ObjectId

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
                            'created_at': {
                                'bsonType': 'date',
                                'description': 'created_at must be a date'
                            },
                            'updated_at': {
                                'bsonType': 'date',
                                'description': 'updated_at must be a date'
                            }
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
            updated_page = self.collection.findByIdAndUpdate(page_data['_id'], page_data)
            print(updated_page)
            if updated_page is None:
                return False, { "error": "Page not updated" }
            return True, updated_page
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
    """ def to_dict(self, instance):
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
        } """
    
    def to_dict(self, instance):
        page_data = {
            "configName": instance["configName"],
            "admin": instance["admin"],
            "image": instance["image"],
            "title": instance["title"],
            "description": instance["description"],
            "placeholder": [', '.join(sublist) for sublist in instance["placeholder"]],
            "variableName": [', '.join(sublist) for sublist in instance["variableName"]],
            "outputName": instance["outputName"],
            "outputValue": instance["outputValue"],
            "outputUnit": instance["outputUnit"],
            "calculation": instance["calculation"],
            "id": str(instance["_id"]) if "_id" in instance else None
        }
        return page_data

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

class Customer:
    def __init__(self, db):
        # Set collection name
        self.collection_name = 'customers'
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
                            'name': {
                                'bsonType': 'string',
                                'description': 'name must be a string'
                            },
                            'surname': {
                                'bsonType': 'string',
                                'description': 'surname must be a string'
                            },
                            'phone': {
                                'bsonType': 'string',
                                'pattern': '^(\+\d{1,2}\s?)?0?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$',
                                'description': 'phone must be a string and valid phone number'
                            },
                            'created_at': {
                                'bsonType': 'date',
                                'description': 'created_at must be a date'
                            },
                            'updated_at': {
                                'bsonType': 'date',
                                'description': 'updated_at must be a date'
                            }
                        }
                    }
                }
            )

    # CRUD

    # Get customer
    def get(self, customer_data, where="phone"):
        try:
            customer = self.collection.find_one({ where: customer_data[where]})
            if customer:
                return True, customer
            return False, { "error": "Customer not found!" }
        except Exception as e:
            return False, { "error": str(e) }
        
    # Create customer
    def create(self, customer_data):
        try:
            # Insert customer
            customer_data['_id'] = self.collection.insert_one(customer_data).inserted_id
            if customer_data['_id'] is None:
                return False, { "error": "Customer not created" }
            return True, { "_id": str(customer_data['_id']) }
        except Exception as e:
            return False, { "error": str(e) }
        
    # Update customer
    def update(self, customer_data):
        try:
            # Update customer
            customer_data['_id'] = self.collection.update_one({ "phone": customer_data['phone'] }, { "$set": customer_data })
            if customer_data['_id'] is None:
                return False, { "error": "Customer not updated" }
            return True, customer_data['_id']
        except Exception as e:
            return False, { "error": str(e) }
        
    # Delete customer
    def delete(self, customer_data):
        try:
            # Delete customer
            customer_data['_id'] = self.collection.delete_one({ "phone": customer_data['phone'] })
            if customer_data['_id'] is None:
                return False, { "error": "Customer not deleted" }
            return True, customer_data['_id']
        except Exception as e:
            return False, { "error": str(e) }
        
    # Custom Serializer

    def to_dict(self, instance):
        return {
            "name": instance.get("name"),
            "surname": instance.get("surname"),
            "phone": instance.get("phone"),
            "id": str(instance.get("_id")) if instance.get("_id") else None,
            "created_at": instance.get("created_at"),
            "updated_at": instance.get("updated_at")
        }
    
    def from_dict(self, data_dict):
        customer_data = {
            "name": data_dict["name"],
            "surname": data_dict["surname"],
            "phone": data_dict["phone"],
            "created_at": datetime.datetime.now(),
            "updated_at": datetime.datetime.now()
        }
        return customer_data
    


# Test Class
class Person:
    def __init__(self, db):
        # Set collection name
        self.collection_name = 'persons'
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
                            'name': {
                                'bsonType': 'string',
                                'description': 'name must be a string'
                            },
                            'surname': {
                                'bsonType': 'string',
                                'description': 'surname must be a string'
                            },
                            'phone': {
                                'bsonType': 'string',
                                'pattern': '^(\+\d{1,2}\s?)?0?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$',
                                'description': 'phone must be a string and valid phone number'
                            },
                            'created_at': {
                                'bsonType': 'date',
                                'description': 'created_at must be a date'
                            },
                            'updated_at': {
                                'bsonType': 'date',
                                'description': 'updated_at must be a date'
                            }
                        }
                    }
                }
            )

    # CRUD
    def get(self, person_data, where="phone"):
        try:
            person = self.collection.find_one({ where: person_data[where]})
            if person:
                return True, person
            return False, { "error": "Person not found!" }
        except Exception as e:
            return False, { "error": str(e) }
        
    def create(self, person_data):
        try:
            # Insert person
            person_data['created_at'] = datetime.now()
            person_data['updated_at'] = datetime.now()

            person_data['_id'] = self.collection.insert_one(person_data).inserted_id
            if person_data['_id'] is None:
                return False, { "error": "Person not created" }
            return True, { "_id": str(person_data['_id']) }
        except Exception as e:
            return False, { "error": str(e) }
        
    # Function to serialize a Python object to JSON string
    def serialize_to_json(self, data):
        try:
            return json.dumps(data, default=self._json_serial, indent=4)
        except Exception as e:
            return str(e)


    # Function to deserialize a JSON string to a Python object
    def deserialize_from_json(self, json_string):
        try:
            return json.loads(json_string)
        except Exception as e:
            return str(e)

    # Helper function to handle non-serializable data types
    def _json_serial(self, obj):
        """JSON serializer for objects not serializable by default json code"""
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        elif isinstance(obj, ObjectId):
            return str(obj)
        raise TypeError ("Type not serializable")