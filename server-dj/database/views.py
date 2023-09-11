from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .dbconnect import connect_to_mongodb
import bcrypt
import jwt
from calctool import settings
import datetime
from bson.objectid import ObjectId
from django.core.files.storage import FileSystemStorage
import json
import re
from pprint import pprint

# User Views

class UsersView(APIView):
    def get(self, request):
        try:
            client = connect_to_mongodb()
            user_model = User(client['tool'])
            if client:
                users = client['tool']['users'].find()
                serialized_users = [user_model.to_dict(user) for user in users]
                return Response(serialized_users)
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })

class CreateUserView(APIView):
    def post(self, request):
        try:
            client = connect_to_mongodb()
            user_model = User(client['tool'])
            if client:
                user_data = user_model.from_dict(request.data)
                is_created, error = user_model.create(user_data)
                print(is_created, error)
                if is_created:  
                    return Response({ "success": "User created" })
                else:
                    return Response({ "error": error })
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })

                
class LoginUserView(APIView):  
    def post(self, request):
        try:
            client = connect_to_mongodb()
            user_model = User(client['tool'])
            if client:
                user_data = user_model.from_dict(request.data, is_full=False)
                is_found, user_or_error = user_model.get(user_data)
                if is_found:

                    if bcrypt.checkpw(user_data['password'].encode('utf-8'), user_or_error['password'].encode('utf-8')):
                        payload = { 
                            "id": str(user_or_error['_id']),
                            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                            "iat": datetime.datetime.utcnow()
                        }
                        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
                        response_data = user_model.to_dict(user_or_error, token=token)
                        response = Response(response_data)
                        response.set_cookie(key='jwt', value=token, httponly=True)
                        return response
                    else:
                        return Response({ "error": "Invalid credentials" })
                else:
                    return Response({ "error": user_or_error })
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })
        
class UserView(APIView):
    def get(self, request):
        try:
            client = connect_to_mongodb()
            user_model = User(client['tool'])
            if client:
                token = request.COOKIES.get('jwt')
                if token:
                    try:
                        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                        id = ObjectId(decoded_token['id'])
                        is_found, user = user_model.get({"_id": id}, where="_id")
                        if is_found:
                            response_data = user_model.to_dict(user)
                            return Response(response_data)
                        else:
                            return Response({ "error": user })
                    except Exception as e:
                        print(f"Error:", e)
                        return Response({ "error": "Invalid token" })
                else:
                    return Response({ "error": "Token not found" })
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })
        
class LogoutUserView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            "message": "success"
        }
        return response
    
# Page Views

class PagesView(APIView):
    def get(self, request):
        try:
            client = connect_to_mongodb()
            page_model = Page(client['tool'])
            if client:
                pages = client['tool']['pages'].find()
                if pages is None:
                    return Response({ "error": "No pages found" })
                serialized_pages = [page_model.to_dict(page) for page in pages]
                pprint(serialized_pages)
                return Response(serialized_pages)
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })
        
class PageView(APIView):
    def get(self, request):
        try:
            client = connect_to_mongodb()
            page_model = Page(client['tool'])
            if client:
                id = request.GET.get('id', None)
                config_name = request.GET.get('configName', None)
                if id is not None:
                    if not ObjectId.is_valid(id):
                        return Response({ "error": "Invalid id" })
                    elif id is not None and config_name is None:
                        page = client['tool']['pages'].find_one({ "_id": ObjectId(id) })
                        if page is None:
                            return Response({ "error": "No page found" })
                        serialized_page = page_model.to_dict(page)
                        return Response({ "serialized_page": serialized_page })
                
                if config_name is None:
                    return Response({ "error": "No config name provided" })
                else:  
                    page = client['tool']['pages'].find_one({ "configName": config_name })
                    if page is None:
                        return Response({ "configName": config_name })
                    serialized_page = page_model.to_dict(page)
                    return Response({ "serialized_page": serialized_page, "error": "The config name is already given to another page setting!" })
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })
        
class CreatePageView(APIView):
    def post(self, request):
        try:
            client = connect_to_mongodb()
            page_model = Page(client['tool'])
            if client:
                page_data = page_model.from_dict(request.data)
                print("page_data", page_data)
                image_files = request.FILES.getlist('image') # get the files from the request
                # save the files to the server
                image_files_array = []
                if image_files:
                    for image_file in image_files:
                        fs = FileSystemStorage()
                        filename = fs.save(image_file.name, image_file)
                        uploaded_file_url = fs.url(filename)
                        image_files_array.append(uploaded_file_url)
                    page_data['image'] = image_files_array
                is_created, page_or_error = page_model.create(page_data)
                if is_created:
                    return Response(page_or_error)
                else:
                    return Response({ "error": page_or_error })
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })
        
class UpdatePageView(APIView):
    def put(self, request):
        try:
            client = connect_to_mongodb()
            page_model = Page(client['tool'])
            if client:
                id = request.GET.get('id', None)
                is_found, page = page_model.get({ "_id": ObjectId(id) }, where="_id")
                config_name = page['configName']
                admin = page['admin']
                if id is not None:
                    if not ObjectId.is_valid(id):
                        return Response({ "error": "Invalid id" })
                    elif id is not None:
                        if page is None:
                            return Response({ "error": "No page found" })
                        request.data['configName'] = config_name
                        request.data['admin'] = admin
                        page_data = page_model.from_dict(request.data)
                        image_files = request.FILES.getlist('image') # get the files from the request
                        # save the files to the server
                        image_files_array = []
                        if image_files:
                            for image_file in image_files:
                                fs = FileSystemStorage()
                                filename = fs.save(image_file.name, image_file)
                                uploaded_file_url = fs.url(filename)
                                image_files_array.append(uploaded_file_url)
                            page_data['image'] = image_files_array
                        page_data['configName'] = config_name
                        is_updated, page_or_error = page_model.update(page_data)
                        print("is_updated", is_updated)
                        print("page_or_error", page_or_error)
                        if is_updated:
                            serialized_page = page_model.to_dict(page_or_error)
                            return Response({ "serialized_page": serialized_page })
                        if is_updated:
                            return Response(page_or_error)
                        else:
                            return Response({ "error": page_or_error })
                else:
                    return Response({ "error": "No id provided" })
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })
        

class DeletePageView(APIView):
    def delete(self, request):
        try:
            client = connect_to_mongodb()
            page_model = Page(client['tool'])
            if client:
                id = request.GET.get('id', None)
                if id is not None:
                    if not ObjectId.is_valid(id):
                        return Response({ "error": "Invalid id" })
                    elif id is not None:
                        is_deleted, page_or_error = page_model.delete(id)
                        if is_deleted:
                            return Response(page_or_error)
                        else:
                            return Response({ "error": page_or_error })
                else:
                    return Response({ "error": "No id provided" })
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })

# Customer Views

class CustomersView(APIView):
    def get(self, request):
        try:
            client = connect_to_mongodb()
            customer_model = Customer(client['tool'])
            if client:
                customers = client['tool']['customers'].find()
                serialized_customers = [customer_model.to_dict(customer) for customer in customers]
                return Response(serialized_customers)
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })
        
class CustomerView(APIView):
    def get(self, request):
        try:
            client = connect_to_mongodb()
            customer_model = Customer(client['tool'])
            if client:
                id = request.GET.get('id', None)
                if id is not None:
                    if not ObjectId.is_valid(id):
                        return Response({ "error": "Invalid id" })
                    elif id is not None:
                        customer = client['tool']['customers'].find_one({ "_id": ObjectId(id) })
                        if customer is None:
                            return Response({ "error": "No customer found" })
                        serialized_customer = customer_model.to_dict(customer)
                        return Response({ "serialized_customer": serialized_customer })
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })
        
class CreateCustomerView(APIView):
    def post(self, request):
        try:
            client = connect_to_mongodb()
            customer_model = Customer(client['tool'])
            if client:
                customer_data = customer_model.from_dict(request.data)
                is_created, customer_or_error = customer_model.create(customer_data)
                if is_created:
                    return Response(customer_or_error)
                else:
                    return Response({ "error": customer_or_error })
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })


# Calculation Views

class CalculationView(APIView):
    def post(self, request):
        results = {}

        try:
            client = connect_to_mongodb()
            if client:
                expressions = json.loads(request.data.get('expressions'))
                outputs = json.loads(request.data.get('outputs'))

                for output in outputs:
                    results[output] = None

                pattern = "FILL!([A-Za-z]+)!"

                for index, expr in enumerate(expressions):
                    newExp = None
                    # Check if the pattern matches the expression
                    if re.search(pattern, expr):
                        matches = re.findall(pattern, expr)
                        char = matches[0]  # Assuming there's only one match in each expression
                        value = results.get(char)
                        newExp = re.sub(f"FILL!{char}!", str(value), expr)

                    # Evaluate the expression using Python's eval (be very cautious when using eval, it can be dangerous)
                    result = eval(newExp) if newExp else eval(expr)  
                    key = outputs[index]
                    results[key] = result

                return Response(results)
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })
        

# Test Views

class PersonsView(APIView):
    def get(self, request):
        try:
            client = connect_to_mongodb()
            person_model = Person(client['tool'])
            if client:
                persons = client['tool']['persons'].find()
                """ print("type(persons)", type(persons))
                for person in persons:
                    print("type(person)", type(person))
                    print("person", person) """
                persons_list = [person for person in persons]
                serialized_persons = person_model.serialize_to_json(persons_list)                
                print(serialized_persons)
                return Response(serialized_persons)
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })
        
class CreatePersonView(APIView):
    def post(self, request):
        try:
            client = connect_to_mongodb()
            person_model = Person(client['tool'])
            if client:
                person_data = {k: v[0] for k, v in request.data.lists()}
                
                is_created, person_or_error = person_model.create(person_data)
                if is_created:
                    return Response(person_or_error)
                else:
                    return Response({ "error": person_or_error })
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })