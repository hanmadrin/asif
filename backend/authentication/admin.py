from django.contrib import admin

from . import models

admin.site.register(models.User)
admin.site.register(models.Doctor)
admin.site.register(models.Boarding)
admin.site.register(models.Shop)
admin.site.register(models.Transportation)
admin.site.register(models.Rescue)
admin.site.register(models.Adoption)
