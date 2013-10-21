mkdir logs run tmp
m2sh load -config cloudlet_platform.conf -db cloudlet_platform.db
sudo m2sh start -db cloudlet_platform.db -every