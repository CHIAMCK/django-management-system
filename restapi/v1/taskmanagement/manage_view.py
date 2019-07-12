from restapi.v1.taskmanagement.views.add_task import TaskAddView
from rest_framework.response import Response
from rest_framework.views import APIView


class BaseManageView(APIView):
    def dispatch(self, request, *args, **kwargs):
        if not hasattr(self, 'VIEWS_BY_METHOD'):
            raise Exception('VIEWS_BY_METHOD is not found')
        if request.method in self.VIEWS_BY_METHOD:
            return self.VIEWS_BY_METHOD[request.method]()(request, *args, **kwargs)
        return Response(status=405)


class TaskManageView(BaseManageView):
    # using different views for different http methods
    VIEWS_BY_METHOD = {
        'POST': TaskAddView.as_view
    }