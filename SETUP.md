gcloud beta container --project "resttlers" clusters create "resttlers" \
  --zone "australia-southeast1-a" \
  --release-channel "regular" \
  --num-nodes "1" \
  --machine-type "n1-standard-1" \
  --image-type "COS" \
  --disk-type "pd-standard" \
  --disk-size "10" \
  --no-enable-basic-auth \
  --metadata disable-legacy-endpoints=true \
  --scopes "https://www.googleapis.com/auth/devstorage.read_only","https://www.googleapis.com/auth/logging.write","https://www.googleapis.com/auth/monitoring","https://www.googleapis.com/auth/servicecontrol","https://www.googleapis.com/auth/service.management.readonly","https://www.googleapis.com/auth/trace.append" \
  --enable-stackdriver-kubernetes \
  --enable-ip-alias \
  --network "projects/resttlers/global/networks/default" \
  --subnetwork "projects/resttlers/regions/australia-southeast1/subnetworks/default" \
  --default-max-pods-per-node "110" \
  --addons HorizontalPodAutoscaling,HttpLoadBalancing \
  --enable-autoupgrade \
  --enable-autorepair \
  --maintenance-window "17:00"