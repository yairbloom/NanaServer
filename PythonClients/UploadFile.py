import os.path
import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder

url='http://localhost:3000/uploadfile'
FilePath='/tmp/python-3.8.7-embed-amd64.zip'



with open(FilePath , 'rb') as f:
    m = MultipartEncoder(fields={'myFile': (os.path.basename(FilePath), f, 'application/gzip')})
    headers = {'Content-Type': m.content_type}
    req = requests.post(url, data=m, headers=headers)
    print(req.json())
