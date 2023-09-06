from .constants import user_roles
from pymongo.errors import DuplicateKeyError
import bcrypt
import datetime

class User:
    def __init__(self, db):
        self.collection = db['users']
        # Create index
        self.collection.create_index("email", unique=True)

    # Validate data
    def validate(self, user_data, is_full=True, is_id=False):
        if is_id:
            if '_id' not in user_data or not isinstance(str(user_data['_id']), str):
                return False, { "error": "Invalid id" }
        else:
            if is_full:
                if 'fullName' not in user_data or not isinstance(user_data['fullName'], str):
                    return False, { "error": "Invalid fullName"}
                if 'role' not in user_data or user_data['role'] not in user_roles:
                    return False, { "error": "Invalid role" }
                
            if 'email' not in user_data or not isinstance(user_data['email'], str):
                return False, { "error": "Invalid email" }
            if 'password' not in user_data or not isinstance(user_data['password'], str):
                return False, { "error": "Invalid password" }
            
        return True, None

    # CRUD

    # Get user
    def get(self, user_data, is_full=True, is_id=False, where="email"):
        # Validate data
        if is_id:
            is_valid, error = self.validate(user_data, is_full=False, is_id=is_id)
        else:
            is_valid, error = self.validate(user_data, is_full=is_full)

        # Get user
        if is_valid:
            try:
                # Get user
                user = self.collection.find_one({ where: user_data[where]})
                return True, user
            except:
                # User not found
                return False, { "error": "User not found" }
        else:
            # Invalid data
            return False, error

    # Create user
    def create(self, user_data):
        # Validate data
        is_valid, error = self.validate(user_data)

        # Create user
        if is_valid:
            try:
                # Hash password
                user_data['password'] = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt())
                user_data['created_at'] = datetime.datetime.now()
                user_data['updated_at'] = datetime.datetime.now()

                # Insert user
                user_data['_id'] = self.collection.insert_one(user_data).inserted_id
                return True, user_data['_id']
            except DuplicateKeyError:
                # Email already exists
                return False, { "error": "Email already exists" }
        else:
            # Invalid data
            return False, error

    # Update user    
    def update(self, user_data):
        # Validate data
        is_valid, error = self.validate(user_data)

        # Update user
        if is_valid:
            try:
                # Hash password
                user_data['password'] = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt())
                user_data['updated_at'] = datetime.datetime.now()

                # Update user
                user_data['_id'] = self.collection.update_one({ "email": user_data['email'] }, { "$set": user_data })
                return True, user_data['_id']
            except DuplicateKeyError:
                # Email already exists
                return False, { "error": "User not updated since email already exists" }
        else:
            # Invalid data
            return False, error
    
    # Delete user
    def delete(self, user_data):
        # Validate data
        is_valid, error = self.validate(user_data)

        # Delete user
        if is_valid:
            try:
                # Delete user
                user_data['_id'] = self.collection.delete_one({ "email": user_data['email'] })
                return True, user_data['_id']
            except DuplicateKeyError:
                # User not deleted
                return False, { "error": "User not deleted" }
        else:
            # Invalid data
            return False, error

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
