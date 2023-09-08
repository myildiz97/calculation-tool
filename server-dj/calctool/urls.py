"""
URL configuration for calctool project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from database.views import *
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', UsersView.as_view(), name='users'),
    path('api/users/create/', CreateUserView.as_view(), name='users_create'),
    path('api/users/login/', LoginUserView.as_view(), name='users_login'),
    path('api/users/currentuser/', UserView.as_view(), name='current_user'),
    path('api/users/logout/', LogoutUserView.as_view(), name='users_logout'),
    path('api/pages/', PagesView.as_view(), name='pages'),
    path('api/pages/page/', PageView.as_view(), name='page'),
    path('api/pages/create/', CreatePageView.as_view(), name='pages_create'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)