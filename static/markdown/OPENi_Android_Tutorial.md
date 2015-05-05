#OPENi Android Tutorial
---

This tutorial will cover the use of the OPENi Android client library available for [download](https://demo2.openi-ict.eu/android-sdk/openi-client-lib.aar).

Create a new android project. This project will be used for the purpose of this tutorial.

Download the OPENi Android Client Library and place it into the **libs** folder within your Android project directory.

To enable your android project to utilize the library it must be imported by the porject. This is done in the **gradle.build** file.

The **gradle.build** file should look something like this:

~~~
apply plugin: 'com.android.application'

android {
    compileSdkVersion 21
    buildToolsVersion "20.0.0"

    defaultConfig {
        applicationId "org.tssg.openi.openiandroidtutorial"
        minSdkVersion 16
        targetSdkVersion 21
        versionCode 1
        versionName "1.0"
    }
    buildTypes {
        release {
            runProguard false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
}
~~~
---
###Including the Library
To add the client library into gradle we make the following changes to the gradle.build file.

~~~
apply plugin: 'com.android.application'
...
android {
    ...
    packagingOptions {
        exclude 'META-INF/DEPENDENCIES'
        exclude 'META-INF/NOTICE'
        exclude 'META-INF/LICENSE'
        exclude 'META-INF/LICENSE.txt'
        exclude 'META-INF/NOTICE.txt'
        exclude 'LICENSE.txt'
        exclude 'APK LICENSE.txt'
    }
}

repositories {
    flatDir {
        dirs 'libs'
    }
}

dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile(name:'openi-client-lib', ext:'aar')
}
~~~

**N.B.** The packagingOptions configuration prevents known issues with duplicate META files within dependancies

**libs** is the folder that we placed the client library in when we downloaded it. This addition to the gradle.build file will allow the project to impoirt and use it. 

Once the project is rebuild with these lines included you should have access to the OPENi functions.

---
##Activity Implementation

Using the default blank activity in the android project we will 

We add the call, OPENiAsync.initOPENiAsync("openi_camera_demo_app", this); to the onCreate function. This function takes the identifier for the application that has been setup on the OPENi Platform. In this case we are using an application id that is already setup on the Platform, *openi_camera_demo_app*.
~~~java
@Override
    protected void onCreate(Bundle savedInstanceState) {
        OPENiAsync.initOPENiAsync("openi_camera_demo_app", this);
        ...
        openiTest();
    }
~~~

This function below is called within the onCreate. It shows the use of the OPENiAsync class. In this example We are getting an Object via a call to OPENiAsync.

~~~java
public void openiTest() {
        OPENiAsync.getOPENiAsync().getCloudletObject(new ICloudletObjectCall() {

            @Override
            public Object doProcess(String authToken) throws ApiException {
                return OPENiUtils.getObjectApi().getObjectByAuthToken("0ecc29f0-a6c2-4531-a2b5-5cc27d94caf4", Boolean.FALSE, authToken);
            }
            @Override
            public void onSuccess(Object obj) {
                final OPENiObject oo = (OPENiObject) obj;
                Log.d("Get Object", oo.toString());
                final JSONObject data = OPENiUtils.getObjectData(oo);
                Log.d("Get Object", data.toString());
                Toast toast = Toast.makeText(getApplicationContext(),data.toString(),Toast.LENGTH_LONG);
                toast.show();`
            }
            @Override
            public void onFailure() {
                Log.e("Get Object", "Error getting object by id.");
            }
        });
    }
~~~


--
##Permissions
Add permissions to the **AndroidManifest.xml**

**N.B.** This is needed to allow calls to the OPENi Platform
~~~xml
<?xml version="1.0" encoding="utf-8"?>
<manifest>
    ...
    <uses-permission android:name="android.permission.INTERNET" />
</manifest>
~~~


---

##Running the Applications


When the application is run you will see a login dialog.

Use the login details **openitest**, **openitest** and you should receive a popup showing the data received from OPENi.
