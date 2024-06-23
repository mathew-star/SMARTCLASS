# users/tests/test_views.py

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestRegisterView:
    def test_register_user(self):
        """
        Test the registration of a new user by sending a POST request to the 'register' endpoint with valid user data.
        Checks if the response status code is HTTP 201 Created and if the user with the provided email exists in the database.

        Returns:
            None
        """
        url = reverse('register')
        data = {
            'name': 'Test User',
            'email': 'testuser@example.com',
            'password': 'Password@332'
        }
        client = APIClient()
        response = client.post(url, data, format='json')
        print("Resp: ",response.data)
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(email='testuser@example.com').exists()

    def test_register_user_invalid_data(self):
        """
        Test the registration of a new user with invalid data by sending a POST request to the 'register' endpoint.
        Checks if the response status code is HTTP 400 Bad Request and ensures that a user with the provided email does not exist in the database.

        Returns:
            None
        """
        url = reverse('register')
        data = {
            'name': 'Test User',
            'password': 'password123'
        }
        client = APIClient()
        response = client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert not User.objects.filter(email='testuser@example.com').exists()


@pytest.mark.django_db
class TestUserListView:
    def test_user_list_authenticated(self):
        """
        Test the user list endpoint when the user is authenticated.

        This method creates a user, authenticates the client with that user, sends a GET request to the user list endpoint, and then asserts that the response status code is 200 (HTTP_200_OK) and the length of the response data matches the total number of User objects in the database.

        Assertions:
        - Response status code should be 200 (HTTP_200_OK).
        - Length of response data should be equal to the total number of User objects in the database.

        """
        url = reverse('user-list')
        client = APIClient()
        user = User.objects.create_user(name='Test User', email='testuser@example.com', password='password123')
        client.force_authenticate(user=user)
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == User.objects.count()

    def test_user_list_unauthenticated(self):
        """
        Test the user list endpoint when the user is unauthenticated.

        This method sends a GET request to the user list endpoint without authenticating the client and then asserts that the response status code is 401 (HTTP_401_UNAUTHORIZED).

        Assertions:
        - Response status code should be 401 (HTTP_401_UNAUTHORIZED).

        """
        url = reverse('user-list')
        client = APIClient()
        response = client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestUserDetailView:
    """
    Test case class for testing the UserDetailView API view.

    This class contains test methods to verify the behavior of the UserDetailView API view in a Django application.
    The tests include retrieving a user by ID, handling cases where the user is found and not found.
    Each test method sets up the necessary data, makes API requests, and asserts the expected responses.

    Attributes:
        N/A

    Methods:
        - test_retrieve_user: Test method to retrieve a user by ID and validate the response.
        - test_retrieve_user_not_found: Test method to handle the scenario where the user is not found and validate the response.

    """
    def test_retrieve_user(self):
        """
        Test method to retrieve a user by ID and validate the response.

        This test method creates a new user using the User model with the specified name, email, and password.
        It then constructs the URL for retrieving the user details based on the user's ID.
        An APIClient instance is created to simulate making API requests.
        The user is authenticated using the force_authenticate method.
        A GET request is made to the URL to retrieve the user details.
        The test asserts that the response status code is HTTP 200 OK and that the email in the response data matches the email of the created user.

        This test verifies the functionality of retrieving a user by ID in the UserDetailView API view.

        """
        user = User.objects.create_user(name='Test User', email='testuser@example.com', password='password123')
        url = reverse('user-detail', kwargs={'user_id': user.id})
        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == 'testuser@example.com'

    def test_retrieve_user_not_found(self):
        """
        Test method to handle the scenario where the user is not found and validate the response.

        This test method sets up the necessary data by creating a new user using the User model with the specified name, email, and password.
        It then constructs the URL for retrieving the user details based on a non-existing user ID.
        An APIClient instance is created to simulate making API requests.
        The user is authenticated using the force_authenticate method.
        A GET request is made to the URL to retrieve the user details.
        The test asserts that the response status code is HTTP 404 Not Found.

        This test verifies the behavior of the UserDetailView API view when attempting to retrieve a user that does not exist.
        """
        url = reverse('user-detail', kwargs={'user_id': 999})
        client = APIClient()
        user = User.objects.create_user(name='Test User', email='testuser@example.com', password='password123')
        client.force_authenticate(user=user)
        response = client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND




    def test_block_user_not_found(self):
        """
        Test class for testing the block_user method.
        Includes a test to block a user and verify if the user is successfully blocked.
        """
        url = reverse('block-user', kwargs={'user_id': 999})
        client = APIClient()
        admin_user = User.objects.create_superuser(name='Admin', email='admin@example.com', password='adminpassword')
        client.force_authenticate(user=admin_user)
        response = client.post(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestUnblockUserView:
    def test_unblock_user(self):
        """
        Test case for unblocking a user.

        Creates a blocked user, sets up the necessary URL, client, and admin user for authentication.
        Sends a POST request to unblock the user.
        Asserts that the response status code is 200 (HTTP_200_OK) and that the user is no longer blocked after unblocking.

        This test ensures that the unblocking functionality works correctly in the system.

        Returns:
            None
        """
        blocked_user = User.objects.create_user(name='Blocked User', email='blocked@example.com', password='password123', is_blocked=True)
        url = reverse('unblock-user', kwargs={'user_id': blocked_user.id})
        client = APIClient()
        admin_user = User.objects.create_superuser(name='Admin', email='admin@example.com', password='adminpassword')
        client.force_authenticate(user=admin_user)
        response = client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert User.objects.get(id=blocked_user.id).is_blocked is False

    def test_unblock_user_not_found(self):
        """
        Test case for unblocking a user that does not exist.

        Attempts to unblock a user with a non-existing user_id.
        Sets up the necessary URL, client, and admin user for authentication.
        Sends a POST request to unblock the user.
        Asserts that the response status code is 404 (HTTP_404_NOT_FOUND).

        This test ensures that the system handles unblocking a non-existing user correctly.
        """
        url = reverse('unblock-user', kwargs={'user_id': 999})
        client = APIClient()
        admin_user = User.objects.create_superuser(name='Admin', email='admin@example.com', password='adminpassword')
        client.force_authenticate(user=admin_user)
        response = client.post(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND
