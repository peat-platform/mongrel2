OPENi Cloudlet SDK Tutorial
=====

---

### Generating the SDK

Inside the "openi_android_sdk" folder run the following command.

**N.B.** Change the *IP Address* to the adress of your local OPENi Development VM

~~~Shell
sh build-cloudlet-sdk.sh 192.168.33.10
~~~

This will generate the *"openi-cloudlet-android-sdk-1.0.0.jar"* file from the OPENi swagger API definitions. 

This jar can be used in OPENi Java projects.

---

The following function examples will work towards getting a working Java project for interacting with the OPENi system and will cover the following actions.
* Registering a Client
* Registering a User
* Loging in as a User to get a Session token
* Using the Session token to authenticate with a Client
* Getting a Cloudlet from OPENi once authenticated.

**Note:** Below these examples will be a complete end-to-end example.


---


####Creating a Client
Clients will be accessing OPENi on behalf of the user and as such must be registered with the OPENi Platform.

**N.B.** This request does not return a body only a status code.
~~~java
public static void setupClient(String clientId) {
	//Setup Client API
	ClientsApi clientsapi = new ClientsApi();
	//Prepare the client request object.
	ClientRegisterRequest clientIdReq = new ClientRegisterRequest();
	//Set the Id of the new client to be created
	clientIdReq.setClientId(clientId);
	//Call ClientAPI to create new client.
	try {
		clientsapi.createClient(clientIdReq);
	} catch (ApiException e) {
		if (e.getCode() == 400) {
			System.out.println("Client already exists");
		} else {
			e.printStackTrace();
		}
	}
}
~~~
---


####Registering a User
Users currently register with the OPENi system using a *username* and *password*

**N.B.** This request does not return a body only a status code.
~~~java
public static void registerUser(String username, String password) {
	//Setup User API
	UsersApi usersapi = new UsersApi();
	//Prepare User registration request
	UserRegisterRequest userReq = new UserRegisterRequest();
	//Set name and password for user
	userReq.setName(username);
	userReq.setPassword(password);
	//Create User
	try {
		usersapi.createUser(userReq);
	} catch (ApiException e) {
		if (e.getCode() == 400) {
			System.out.println("User already exists");
		} else {
			e.printStackTrace();
		}
	}
}
~~~
---


####Login as User
When a user logs into OPENi they create a Session token that can then be used by a client to authenticate itself and communicate with OPENi on the users behalf.

**N.B.** This request returns a Session token.
~~~java
public static Session login(String username, String password) {
	//Setup API
	SessionApi sessionapi = new SessionApi();
	//Prepare User registration request
	Credentials creds = new Credentials();
	//Set login credentials
	creds.setName(username);
    creds.setPassword(password);
    //Retrieve Session token
	try {
		Session session = sessionapi.login(creds);
		return session;
	} catch (ApiException e) {
		e.printStackTrace();
		return null;
	}
}
~~~
---


####Authenticate Client for User
The client then uses a Users Session token to authenticate itself before it can begin interactiong with the OPENi Platform.

**N.B.** This request returns an authentication Token.
~~~java
public static Token authorizeClient(String clientId, Session userSession) {
	//Setup API
	AuthorizeApi authorizeapi = new AuthorizeApi();
	//Prepare authorization request
	AuthorizationRequest authreq = new AuthorizationRequest();
	//Set ClientId and Session
	authreq.setClientId(clientId);
	authreq.setSession(userSession.getSession());
    //Retrieve Authorization token
	try {
		Token token = authorizeapi.authorizeClient(authreq);
		return token;
	} catch (ApiException e) {
		e.printStackTrace();
		return null;
	}
}
~~~
---


####Using Authorization Token to get Cloudlet
Once the Token has been received the users cloudletId can be retrieved by passing the Token to the OPENi Platform vie the CloudletsAPI.

**N.B.** This request returns an OPENiCloudlet object.
~~~java
public static OPENiCloudlet getCloudletData(Token authToken) {
    	//Setup CloudletAPI
    	CloudletsApi cloudletapi = new CloudletsApi();
        //Get Cloudlet
    	try {
    		OPENiCloudlet cloudletData = cloudletapi.getCloudletId(authToken.getToken());
    		return cloudletData;
		} catch (ApiException e) {
			e.printStackTrace();
			return null;
		}
    }
~~~
---

---

###Example 1: Authentication and retrieve Cloudlet
This function brings all the previous functions together as the first end-to-end example. This example
* Creates a testClient
* Creates a TestUser
* Gets the User Session
* Gets the Auth Token
* Retrieves Users CloudletId

~~~java
public static void main(String[] args) {    	
	//Setup Required Client and User for Example
	setupClient("testClient");
	registerUser("TestUser","secret");
	
	//Get user Session to authorize client
	Session userSession = login("TestUser","secret");
	if (userSession == null) {
		throw new Error("Error getting user Session token");
	}
	
	//get Authorization Token to access OPENi platform
	Token authToken = authorizeClient("testClient", userSession); 	
	if (authToken == null) {
		throw new Error("Error getting Authtoken");
	}
    // Use AuthToken to get Cloudlet
    OPENiCloudlet cloudletData = getCloudletData(authToken);
    System.out.println(cloudletData);
}
~~~
---

####Creating a Type
The OPENi type consists of multple layers. 
* **The Context** An array of properties within the Type.
* **Context Entry** The descriptor for a single property within the Type.
* **Context Value** METADATA about the single property including an *ID* and the OPENi primative type of that property.

 
**N.B.** The two required fields for a type are *context* and *reference*

~~~java
public static CreateResponse createExampleType() {
	//Setup API
	TypesApi typeApi = new TypesApi();
	//Create empty Type
	OPENiType type = new OPENiType();
	//METADATA for single property within type
	ContextValue property = new ContextValue();
	property.setId("openi:name");
	property.setOpeniType("string");
	//Single Type Property
	ContextEntry context = new ContextEntry();
	context.setPropertyName("name");
	context.setPropertyContext(property);
	//List of Type Properties
	List<ContextEntry> typeContext = new ArrayList<ContextEntry>();
	//Add the property to the list
	typeContext.add(context);
	//Add the list to the type
	type.setContext(typeContext);
	//Set Type reference as it is a required field
	type.setReference("Name");
	
	//Post Type
	try {
		CreateResponse resp = typeApi.createType(type);
		return resp;
	} catch (ApiException e) {
		e.printStackTrace();
		return null;
	}
}
~~~
---

####Creating an Object
This example will create an Object with a Type id of the one created above.
~~~java
public static ObjectResponse createExampleObject(OPENiCloudlet cloudlet, CreateResponse type) {
    	//Setup API
    	ObjectsApi objectApi = new ObjectsApi();
    	//Create empty Type
    	OPENiObject object = new OPENiObject();
    	//Set Object Type
    	object.setOpeniType(type.getId());
    	//Create Map for object Data
    	Map data = new HashMap<>();
    	data.put("name", "TestName");
    	object.setData(data);
    	
    	//Create Object
    	try {
    		ObjectResponse resp = objectApi.createObject(cloudlet.getId(), object);
    		return resp;
		} catch (ApiException e) {
			e.printStackTrace();
			return null;
		}
    }
~~~
---

###Example 2: Creating a Type and an Object of that Type.
This function will extend example 1. It will 
* Create a Type
* Create an Object of that type in a users Cloudlet.

With a small extension to The main function in Example one the cloudlet ID retrieved can be used to create an Object.

---



~~~java
public static void main(String[] args) {   
 ...
 
    CreateResponse exampleType = createExampleType();
    System.out.println(exampleType);
    
    ObjectResponse exampleObject = createExampleObject(cloudletData,exampleType);
    System.out.println(exampleObject);
}
~~~


