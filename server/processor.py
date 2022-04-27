import socket
from phttp import request as _Request
from phttp import response as _Response


class Processor():
    def __init__(self, client):
        self.client = client
        self.api_path = b'/'

    def process(self, _connection: socket.socket):
        _return_status = 0
        self.connection = _connection
        _return_status = self._set_request()
        self.response = _Response.ResponseBuilder(self.connection)
        if _return_status == 1:
            if self.request.method == b'GET':
                _return_status = self._process_get()
            # elif self.request.method == b'POST':
            #     _return_status = self._process_post()

            self.response.set_content_length()
            self.response.send()

        self.connection.close()

        return _return_status

    def _set_request(self):
        try:
            self.request = _Request.RequestProcessor(self.connection)
            if self.request.forwarded_for != b'':
                self.client = self.request.forwarded_for.replace(b'\r', b'')
                self.client.decode()
        except Exception:
            return 0

        return 1

    def _get_static_file(self) -> int:
        _tmp = self.request.headline[1].decode().split('?')[0]
        _tmp = _tmp.split('.')[-1]
        # TODO Test against media types enum
        if _tmp != 'html':
            _file = self.request.headline[1].decode()
            _file = _file.split('?')[0]
            self.response.body_from_file(file=_file[1:])
            if _tmp != 'svg':
                self.response.add_header('Cache-Control',
                                         'must-revalidate, max-age=0')
            return 1
        return 0

    def _process_get(self):
        _return_status = 0

        if b'.' in self.request.path:
            _return_status = self._get_static_file()
        else:
            self.response.body_from_file(file='index.html')

        return _return_status

    def _process_post(self):
        _return_status = 0

        return _return_status
