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
            elif self.request.method == b'POST':
                _return_status = self._process_post()

        # if _return_status == 0:
        #     _ci = {'$error': ''}
        #     self.response.body_from_parts(content='error.html',
        #                                   content_inject=_ci)
        self.response.body = self.response.body.replace(b'$who', b'http://127.0.0.1:8899')
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
        _Api_req_dat = []

        if b'.' in self.request.path:
            _return_status = self._get_static_file()
        else:
            self.response.body_from_file(file='index.html')

        # if self.request.path == b'/':
        #     _return_status = 1
        #     _ci = {'$search_results': ''}
        #     self.response.body_from_parts(content='main.html',
        #                                   content_inject=_ci)
        # elif self.request.path.startswith(b'/about'):
        #     _return_status = 1
        #     self.response.body_from_parts(content='about.html')
        # elif self.request.path.startswith(b'/howto'):
        #     _return_status = 1
        #     self.response.body_from_parts(content='howto.html')
        # elif self.request.path.startswith(b'/marketplace'):
        #     _return_status = 1
        #     _return_status = self._get_marketplace()
        # elif self.request.path.startswith(b'/search'):
        #     _return_status = 1
        #     if len(self.request.query_string) == 0:
        #         _ci = {'$search_results': ''}
        #         self.response.body_from_parts(content='main.html',
        #                                       content_inject=_ci)
        #     else:
        #         _Api_req_dat.append(self.request.query_string[0].decode())
        #         _dt = self.content_path
        #         _Api_req_dat.append(_dt)
        #         _result = self.sAPI.search_get_namespace(_Api_req_dat)
        #         self.response.body_from_parts(content='main.html',
        #                                       content_inject=_result)
        # elif self.request.path.startswith(b'/shutdown'):
        #     _return_status = 3
        #     self.response.body_from_parts(content='shutdown.html')
        # elif b'.' not in self.request.path:
        #     _return_status = self._test_for_namespace()

        return _return_status

    def _process_post(self):
        _return_status = 0
        if self.request.path == (b'/search'):
            _return_status = 1
            # HACK Fix this up to be functional
            self.request.body = self.request.body.replace(b'search=', b'')
            self.response.status_code = 301
            self.response.status_text = 'Moved'
            self.response.add_header('Location',
                                     '/' + self.request.body.decode())
        elif self.request.path == (b'/_kv/reward'):
            _result = self.sAPI.add_wallet_action('reward', self.request.body)
            self.response.body_from_json(_result)
            _return_status = 1
        elif self.request.path == (b'/_kv/comment'):
            _result = self.sAPI.add_wallet_action('comment', self.request.body)
            self.response.body_from_json(_result)
            _return_status = 1
        elif self.request.path == (b'/_kv/repost'):
            _result = self.sAPI.add_wallet_action('repost', self.request.body)
            self.response.body_from_json(_result)
            _return_status = 1
        elif self.request.path == (b'/_kv/share'):
            _result = self.sAPI.add_wallet_action('share', self.request.body)
            self.response.body_from_json(_result)
            _return_status = 1
        elif self.request.path == (b'/_kv/bid'):
            _result = self.sAPI.add_wallet_action('bid', self.request.body)
            self.response.body_from_json(_result)
            _return_status = 1

            # _response = _Response.ResponseBuilder(_connection, self.client)
            # _response.body_from_parts(content='/error.html',
            #         content_inject={'$error': er}, path=self.content_path)
            # _response.body = _response.body.replace(b'$who',
            #                                         self.who.encode())
            # _response.set_content_length()
            # _response.send()
        return _return_status
