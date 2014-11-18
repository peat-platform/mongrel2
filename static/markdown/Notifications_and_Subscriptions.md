#Notifications and Subscriptions
---

### Server-Sent Events

In order to complete this tutorial two objects are required.
* Create each objects within the same Cloudlet.
* Record both the objectID and the CloudletID for each.

Using these 2 objects we will create 2 SSE notifications, one object based and one cloudlet based.

The first is a subscription that focuses on a single object within a cloudlet, if this object is changed then a notification is triggered.

**N.B.** Place your recorded IDs into the JSON below.

~~~json
{
  "cloudletid": [CloudletID],
  "objectid"  : [ObjectID],
  "type"      : "SSE"
}
~~~



This subscription is a cloudlet level subscription. If any object within this cloudlet is changed a notification will be sent out.

~~~json
{
  "cloudletid": [CloudletID],
  "type"      : "SSE"
}
~~~
