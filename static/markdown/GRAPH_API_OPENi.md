#REST calls to the OPENi Graph API

Here you can find all the available resources (objects) of our Graph API. Under every resource you can find the available REST calls you can make. 

In order to use the OPENi Graph API Framework you can make simple calls to the base URI  appended by the version of the API, currently v.04, and the object needed.

So the url should look like this:

https://demo2.openi-ict.eu:443/v.04/[ObjectName]
e.g. https://demo2.openi-ict.eu:443/v.04/Photo/

After this basic url you should append the parameters you need. There are two parameters that are found under almost all available methods.
* user ( the user for whom you need the info - should be already authenticated to the platform )

* cbs ( an array of CBS applications to which you need the method to be called, for example ["facebook","twitter"] )  
 Through the OPENi Graph API you can make calls to the Cloudlet but also invoke methods of the available 3rd party Cloud Based Services. This is why under almost all methods you can find the parameter cbs which you can use to specify to which Cloud Based Service(s) you want your call to be redirected.  
Valid cbs values are only the following: "twitter","foursquare", "facebook", "instagram", "google", "citygrid", "flickr", "dropbox", "youtube", "vimeo", "windowslive". Using extra spaces or capital letters will return an error message.  
If you want to invoke a method that only interacts with the OPENi Cloudlet, you should leave this field blank.  
Note that all method calls are also interacting with the Cloudlet, as this is the default OPENi approach. This essentially means that when invoking a POST method giving for a specific cbs, an object is also created and stored in the OPENi cloudlet as well. 

The rest of the parameters vary depending on the Object and Method.

##Method Invocation Examples
####GET
Example to get all Photo objects for the user romdim from his personal Cloudlet:
```html
curl -k https://demo2.openi-ict.eu:443/v.04/Photo/?user=romdim
```

And the response:
```json
[
  {
    "CBS": "Only Cloudlet Objects were retrieved. No additional CBS were selected."
  },
  {
    "meta": {
      "limit": 20,
      "next": null,
      "offset": 0,
      "previous": null,
      "total_count": 1
    },
    "objects": [
      {
        "From": "/v.04/From/47/",
        "Location": "/v.04/Location/2/",
        "Tag": null,
        "Time": "/v.04/Time/47/",
        "context": "/v.04/Context/23/",
        "height": "string",
        "id": 1,
        "object_type": "",
        "profile": "string",
        "resource_uri": "/v.04/Photo/1/",
        "service": "OPENi Cloudlet",
        "url": "",
        "width": "string"
      }
    ]
  }
]
```

Example to get all Photo objects for the user romdim from facebook and from his personal Cloudlet:
```html
curl -k https://demo2.openi-ict.eu:443/v.04/Photo/?cbs=%5B%22facebook%22%5D&user=romdim
```

And the response:
```json
[
  {
    "meta": {
      "limit": null,
      "next": "https://graph.facebook.com/v1.0/675350314/photos?access_token=CAABptKWDIR0BAGZCDOxZCXaw2zZChUHOIMlmR9enE3zZCCLUsZBs6ZCWeFd1svsiwOMaKi1NV7uAuWYQLmfGEE2WvUI07Cr81C8kMTBpbFZAZCSIyT2pOfUoG7oJCSThO6bX25voN1RcaGIkZAD1fvqi8elVA85sd6g96l6RoCdCB857iA1VM3oHpTrCbG5eIw7caWIWXZBVsBTdqoOZC0qRE4NphsrLo90CZBVDujyWS0Sq6W6mSwO17XMqbglQOBWbTVSXvu76Teg6YmukR4bqO9TXsjB5TpYsB4tgl9HCIV5zTTknaHTaZACJz3YaRUTpjvE4ZD&limit=25&after=TVRBeU1ERTRNamN5TVRNMU56YzJOamc2TVRNNE1UYzRNamcxTmpvek9UUXdPRGsyTkRBMk5EYzRNelk9",
      "offset": 0,
      "previous": null,
      "total_count": 3
    },
    "objects": [
      {
        "file": {
          "description": "",
          "format": "",
          "icon": "https://fbstatic-a.akamaihd.net/rsrc.php/v2/yz/r/StEh3RhPvjk.gif",
          "size": "",
          "title": "12/7/2014 Armenistis"
        },
        "from": {
          "id": "1102326385",
          "name": "Τσουροπλής Γιάννης",
          "object_type": "",
          "resource_uri": ""
        },
        "height": 540,
        "id": "10204238804625937",
        "location": {
          "height": "",
          "latitude": "",
          "longitude": ""
        },
        "object_type": "photo",
        "resource_uri": "https://www.facebook.com/photo.php?fbid=10204238804625937&set=p.10204238804625937&type=1",
        "service": "facebook",
        "tags": [
          {
            "id": "675350314",
            "name": "Romanos Tsouroplis",
            "time": {
              "created_time": "2014-09-10T20:18:31+0000",
              "deleted_time": "",
              "edited_time": ""
            },
            "x-location": 25.694444444444,
            "y-location": 44.444444444444
          }
        ],
        "time": {
          "created_time": "2014-09-10T20:16:07+0000",
          "deleted_time": "",
          "edited_time": "2014-09-10T20:18:31+0000"
        },
        "width": 720
      },
      {
        "file": {
          "description": "",
          "format": "",
          "icon": "https://fbstatic-a.akamaihd.net/rsrc.php/v2/yz/r/StEh3RhPvjk.gif",
          "size": "",
          "title": "27/7/2014 πικ νικ"
        },
        "from": {
          "id": "1102326385",
          "name": "Τσουροπλής Γιάννης",
          "object_type": "",
          "resource_uri": ""
        },
        "height": 540,
        "id": "10204238693943170",
        "location": {
          "height": "",
          "latitude": "",
          "longitude": ""
        },
        "object_type": "photo",
        "resource_uri": "https://www.facebook.com/photo.php?fbid=10204238693943170&set=p.10204238693943170&type=1",
        "service": "facebook",
        "tags": [
          {
            "id": "675350314",
            "name": "Romanos Tsouroplis",
            "time": {
              "created_time": "2014-09-10T19:51:04+0000",
              "deleted_time": "",
              "edited_time": ""
            },
            "x-location": 27.777777777778,
            "y-location": 88.425925925926
          }
        ],
        "time": {
          "created_time": "2014-09-10T19:47:51+0000",
          "deleted_time": "",
          "edited_time": "2014-09-10T19:51:04+0000"
        },
        "width": 720
      },
      {
        "file": {
          "description": "",
          "format": "",
          "icon": "https://fbstatic-a.akamaihd.net/rsrc.php/v2/yz/r/StEh3RhPvjk.gif",
          "size": "",
          "title": "29/9/2013 Beach volley tournament @ Village Park Renti"
        },
        "from": {
          "id": "1102326385",
          "name": "Τσουροπλής Γιάννης",
          "object_type": "",
          "resource_uri": ""
        },
        "height": 540,
        "id": "10201827213577668",
        "location": {
          "height": "",
          "latitude": "",
          "longitude": ""
        },
        "object_type": "photo",
        "resource_uri": "https://www.facebook.com/photo.php?fbid=10201827213577668&set=p.10201827213577668&type=1",
        "service": "facebook",
        "tags": [
          {
            "id": "685638251",
            "name": "Tsouroplis Achilleas",
            "time": {
              "created_time": "2013-10-14T20:34:18+0000",
              "deleted_time": "",
              "edited_time": ""
            },
            "x-location": 29.479166666667,
            "y-location": 77.5
          },
          {
            "id": "675350314",
            "name": "Romanos Tsouroplis",
            "time": {
              "created_time": "2013-10-14T20:34:16+0000",
              "deleted_time": "",
              "edited_time": ""
            },
            "x-location": 46.875,
            "y-location": 70.555555555556
          }
        ],
        "time": {
          "created_time": "2013-10-14T20:29:08+0000",
          "deleted_time": "",
          "edited_time": "2013-10-14T20:34:16+0000"
        },
        "width": 720
      }
    ]
  },
  {
    "meta": {
      "limit": 20,
      "next": null,
      "offset": 0,
      "previous": null,
      "total_count": 1
    },
    "objects": [
      {
        "From": "/v.04/From/47/",
        "Location": "/v.04/Location/2/",
        "Tag": null,
        "Time": "/v.04/Time/47/",
        "context": "/v.04/Context/23/",
        "height": "string",
        "id": 1,
        "object_type": "",
        "profile": "string",
        "resource_uri": "/v.04/Photo/1/",
        "service": "OPENi Cloudlet",
        "url": "",
        "width": "string"
      }
    ]
  }
]
```
You can see that Photo Objects coming from different sources (facebook, OPENi) are returned in the same JSON response but inside different JSON arrays. The "service" field shows which objects come from which CBS/Cloudlet.  
  
  
  
####POST
POst a Photo Object to the user's Cloudlet
```html
curl -k -X POST 
 -H "Content-Type: application/json" 
 -d '{  "profile": "test",  "width": "2",  "context": {},   "Location":"/v.04/Location/2/",  "height": "3"}'  
 https://demo2.openi-ict.eu:443/v.04/Photo/?user=romdim
```
Note that "/v.04/Location/2/" is the URI of a Location Object inside the user's Cloudlet. 
