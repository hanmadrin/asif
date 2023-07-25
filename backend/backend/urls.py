
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path
from django.urls import re_path
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView

from . import views

admin.site.site_header = "Pet Care Admin Control"
admin.site.index_title = 'All Data'
admin.site.site_title = 'Admin Site'


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("authentication.api.urls")),
    # re_path(r'^.*$', TemplateView.as_view(template_name="index.html")),
    # url(r'^path/to/url', TemplateView.as_view(template_name='index.html'))
    # re_path(r'^.*$', RedirectView.as_view(url='/', permanent=True)),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.WEB_URL, document_root=settings.WEB_ROOT)
urlpatterns += static(settings.URL1, document_root=settings.INDEX_ROOT)
urlpatterns += static(settings.URL2, document_root=settings.INDEX_ROOT)
urlpatterns += static(settings.URL3, document_root=settings.INDEX_ROOT)
urlpatterns += static(settings.URL4, document_root=settings.INDEX_ROOT)
urlpatterns += static(settings.URL5, document_root=settings.INDEX_ROOT)
urlpatterns += static(settings.URL6, document_root=settings.INDEX_ROOT)
urlpatterns += static(settings.URL7, document_root=settings.INDEX_ROOT)
urlpatterns += static(settings.URL8, document_root=settings.INDEX_ROOT)
urlpatterns += static(settings.URL9, document_root=settings.INDEX_ROOT)
urlpatterns += static(settings.INDEX_URL, document_root=settings.INDEX_ROOT)
urlpatterns += staticfiles_urlpatterns()
