# importing the requests library 
import requests 
  
# api-endpoint 
URL = "http://localhost:3000/printers/GetPrinters"
  
# defining a params dict for the parameters to be sent to the API 
  
# sending get request and saving the response as response object 
r = requests.get(url = URL) 
  
# extracting data in json format 
data = r.json() 



for printer in data['data']:
  print ('Printer :',printer['Name'])

