import threading
import socket

from processor import Processor


class Server():
    def __init__(self):
        self._thread = None
        self.ssl_thread = None
        self.server_run_state = True
        self.connections = []
        self.load_socket()

    def load_socket(self):
        self.__load_tcp_socket(False)
        # self.__load_tcp_socket(True)

    def __load_tcp_socket(self, _ssl: bool):
        _socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        _socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

        _socket.bind(('127.0.0.1', 8899))

        _socket.listen(5)

        self._thread = threading.Thread(target=self.__receive,
                                        args=(_socket, ))

        self._thread.start()

    def __receive(self, _socket: socket.socket):
        while self.server_run_state is True:
            try:
                c, addr = _socket.accept()
                _conn_thread = threading.Thread(target=self.process,
                                                args=(c, addr[0], ))

                self.connections.append(_conn_thread)
                _conn_thread.start()

            except Exception as er:
                print('error:', er)
        _socket.shutdown(socket.SHUT_RDWR)
        _socket.close()

    def process(self, _connection, c):
        _proc = Processor(c)
        _return_status = _proc.process(_connection)
        if _return_status == 3:
            self.server_run_state = False

Lo = Server()