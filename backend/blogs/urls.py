from django.urls import path
from .views import (
    BlogListView,
    BlogCreateView,
    BlogDetailView,
    BlogUpdateDeleteView,
    UserBlogListView
)

urlpatterns = [
    path('', BlogListView.as_view(), name='blog-list'),
    path('create/', BlogCreateView.as_view(), name='blog-create'),
    path('<int:pk>/', BlogDetailView.as_view(), name='blog-detail'),
    path('<int:pk>/update/', BlogUpdateDeleteView.as_view(), name='blog-update'),
    path('my-blogs/', UserBlogListView.as_view(), name='user-blogs'),
]
