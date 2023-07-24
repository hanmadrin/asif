from django.urls import path

from . import views

urlpatterns = [

    path("signup/user/", views.userSignupView.as_view()),
    path("email-verify/", views.VerifyEmail.as_view(), name='email-verify'),
    path("login/", views.customAuthToken.as_view()),
    path("logout/", views.LogoutView.as_view()),
    path("checkauth/", views.continuousVerificationView.as_view()),
    path('password-change-request/', views.passwordChangeRequestView.as_view()),
    path('password-change-confirm/', views.PasswordChangeConfirmView.as_view()),    

    path('doctors/', views.DoctorListAPIView.as_view(), name='doctor-list'),
    path('boardings/', views.BoardingListAPIView.as_view(), name='doctor-list'),
    path('shops/', views.ShopListAPIView.as_view(), name='doctor-list'),
    path('transportations/', views.TransportationListAPIView.as_view(), name='doctor-list'),

    path('rescues/', views.RescueListAPIView.as_view(), name='rescue-list'),
    path('rescues/<int:pk>/', views.RescueRetrieveUpdateDestroyAPIView.as_view(), name='rescue-detail'),

    path('blogs/', views.BlogListAPIView.as_view(), name='blog-list'),
    path('blogs/<int:pk>/', views.BlogDetailAPIView.as_view(), name='blog-detail'),

    path('adoptions/', views.AdoptionListCreateAPIView.as_view(), name='adoption-list-create'),
    path('adoptions/<int:pk>/', views.AdoptionRetrieveUpdateDestroyAPIView.as_view(), name='adoption-detail'),

]