#include <stdio.h>
#include <string.h>
#include <curl/curl.h>

//g++ -g JobDownloader.cpp -lcurl -o JOB_DOWNLOADER
// JOB_DOWNLOADER  http://localhost:3000/printers/GetJob?PrinterName=p1 /tmp/test1.zip

size_t write_data(void *ptr, size_t size, size_t nmemb, FILE *stream) {
    size_t written;
    written = fwrite(ptr, size, nmemb, stream);
    return written;
}

int main(int argc, char* argv[])
{
    CURL *curl;
    FILE *fp;
    CURLcode res;
    long httpCode(0);
   
    if (argc < 3)
    {
      printf ("Please run: JOB_DOWNLOADER URL DownlodFileName ");

    }
    curl = curl_easy_init();                                                                                                                                                                                                                                                           
    if (curl)
    {   
        fp = fopen(argv[2],"wb");
        curl_easy_setopt(curl, CURLOPT_URL, argv[1]);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, fp);
        res = curl_easy_perform(curl);
        curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &httpCode);
        curl_easy_cleanup(curl);
        fclose(fp);
    }   
    return httpCode;
}
