.PHONY: 
	build tag push deploy update-routing

build:
	docker build -f Dockerfile.engine -t resttlers-engine .
	docker build -f Dockerfile.rest-api -t resttlers-rest-api .
	docker build -f Dockerfile.web-ui -t resttlers-web-ui .

tag:
	docker tag resttlers-engine gcr.io/resttlers/engine
	docker tag resttlers-rest-api gcr.io/resttlers/rest-api
	docker tag resttlers-web-ui gcr.io/resttlers/web-ui

push:
	docker push gcr.io/resttlers/engine
	docker push gcr.io/resttlers/rest-api
	docker push gcr.io/resttlers/web-ui

deploy:
	gcloud app deploy app.engine.yaml --image-url=gcr.io/resttlers/engine --quiet & \
	gcloud app deploy app.rest-api.yaml --image-url=gcr.io/resttlers/rest-api --quiet & \
	wait
	gcloud app deploy app.web-ui.yaml --image-url=gcr.io/resttlers/web-ui --quiet
	

update-routing:
	gcloud app deploy dispatch.yaml

engine-all:
	docker build -f Dockerfile.engine -t resttlers-engine .
	docker tag resttlers-engine gcr.io/resttlers/engine
	docker push gcr.io/resttlers/engine
	gcloud app deploy app.engine.yaml --image-url=gcr.io/resttlers/engine --quiet

rest-api-all:
	docker build -f Dockerfile.rest-api -t resttlers-rest-api .
	docker tag resttlers-rest-api gcr.io/resttlers/rest-api
	gcloud app deploy app.rest-api.yaml --image-url=gcr.io/resttlers/rest-api --quiet

web-ui-all:
	docker build -f Dockerfile.web-ui -t resttlers-web-ui .
	docker tag resttlers-web-ui gcr.io/resttlers/web-ui
	docker push gcr.io/resttlers/web-ui
	gcloud app deploy app.web-ui.yaml --image-url=gcr.io/resttlers/web-ui --quiet