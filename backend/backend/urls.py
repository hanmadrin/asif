
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path

from . import views

admin.site.site_header = "Pet Care Admin Control"
admin.site.index_title = 'All Data'
admin.site.site_title = 'Admin Site'

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("authentication.api.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += staticfiles_urlpatterns()