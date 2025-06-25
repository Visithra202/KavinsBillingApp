from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.contrib.auth.hashers import make_password


# Users

@api_view(['POST'])
def user_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    # print(username + " "+ password)
    user = authenticate(username=username, password=password)
    # print(user)
    if user:
        return Response({"message": "Login successful!"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@transaction.atomic
def add_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    confirm_password = request.data.get("confirm_password")

    if not username or not password:
        return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    if password != confirm_password:
        return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists."}, status=status.HTTP_409_CONFLICT)

    User.objects.create(username=username, password=make_password(password))

    return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)


# Get Users
@api_view(['GET'])
def get_user_list(request):
    users = User.objects.all().values("id", "username")
    user_list = [{"user_id": u["id"], "username": u["username"]} for u in users]
    return Response(user_list, status=status.HTTP_200_OK)


# Delete User
@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({"message": "User deleted successfully!"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)