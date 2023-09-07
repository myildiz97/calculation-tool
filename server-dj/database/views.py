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
import os

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
                config_name = request.GET.get('configName', None)
                if config_name is None:
                    return Response({ "error": "No config name provided" })
                else:  
                    page = client['tool']['pages'].find_one({ "configName": config_name })
                    #page = page_model.get({ "configName": config_name }, where="configName")
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
                image_files = request.FILES.getlist('image')
                image_files_array = []
                if image_files:
                    for image_file in image_files:
                        fs = FileSystemStorage()
                        filename = fs.save(image_file.name, image_file)
                        uploaded_file_url = fs.url(filename)
                        image_files_array.append(uploaded_file_url)
                    page_data['image'] = image_files_array
                #print("page_data", page_data)
                is_created, error = page_model.create(page_data)
                if is_created:
                    return Response({ "success": "Page created" })
                else:
                    return Response({ "error": error })
        except Exception as e:
            print(f"Error:", e)
            return Response({ "error": "Failed to connect to MongoDB" })
        