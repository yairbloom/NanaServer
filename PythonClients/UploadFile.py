import os.path
import requests
import json
from datetime import datetime
from requests_toolbelt.multipart.encoder import MultipartEncoder

FilePath='/tmp/UploadTest.zip'
FilePath='/tmp/OneDrive_2020-01-31.zip'

# api-endpoint 
GetPrintersUrl = "http://localhost:3000/printers/GetPrinters"
NewJobUrl = "http://localhost:3000/printers/NewJob"
  
# defining a params dict for the parameters to be sent to the API 
  
# sending get request and saving the response as response object 
r = requests.get(url = GetPrintersUrl) 
  
# extracting data in json format 
data = r.json() 

if 'data' not in data:
  exit(0)
if len(data['data']) == 0:
  exit(0)

PrintersName = [d['Name'] for d in data['data']]
print(PrintersName)
#exit(0)

PrinterName=data['data'][-1]['Name']
JobName = "{PrinterName}-Job{Date}".format(PrinterName=PrinterName,Date=datetime.now().strftime("%H%M%S"))



with open(FilePath , 'rb') as f:
    m = MultipartEncoder(fields={'myFile': (os.path.basename(FilePath), f, 'application/gzip') ,
                         "PrinterName":PrinterName,
                         "JobName":JobName})
    headers = {'Content-Type': m.content_type}
    req = requests.post(NewJobUrl, data=m, headers=headers)
    print(req.json())
