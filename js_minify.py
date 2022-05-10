import os
import requests
# import shutil
import urllib.parse

# file_paths = []

for file_ in os.listdir('site/js/'):
    if (os.path.isdir('site/js/'+file_) is False):
        # shutil.copy('js/'+file_, 'deploy/' + file_)
        # file_paths.append('deploy/' + file_)

        with open('site/js/'+file_, 'r', encoding='utf-8') as f:
            java = f.read()

        url = 'https://closure-compiler.appspot.com/compile'
        payload = {
            'js_code': java,
            'compilation_level': 'SIMPLE_OPTIMIZATIONS',
            # 'SIMPLE_OPTIMIZATIONS',  # 'WHITESPACE_ONLY ADVANCED_OPTIMIZATIONS
            'output_format': 'text',  # 'json'
            'output_info': 'compiled_code',
            # 'formatting': 'pretty_print'
        }
        headers = {'content-type': 'application/x-www-form-urlencoded'}

        r = requests.post(url, data=urllib.parse.urlencode(payload),
                          headers=headers)
        with open('site/js/' + file_.split('.')[0] + '.min.js', 'w',
                  encoding='utf-8') as wf:
            # file_paths.append('site/js/' + file_.split('.')[0] + '.min.js')
            wf.writelines(r.content.decode())
