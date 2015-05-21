mkdir logs run tmp
m2sh load -config cloudlet_platform.conf -db cloudlet_platform.db

sudo m2sh start -db cloudlet_platform.db -name Http_Redirect
sudo m2sh start -db cloudlet_platform.db -name Cloudlet_Platform
sudo m2sh start -db cloudlet_platform.db -name Internal_Server