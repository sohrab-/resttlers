.PHONY: 
	build push deploy

build:
	docker build -f Dockerfile.engine -t gcr.io/resttlers/engine .
	docker build -f Dockerfile.rest-api -t gcr.io/resttlers/rest-api .
	docker build -f Dockerfile.web-ui -t gcr.io/resttlers/web-ui .

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

engine:
	docker build -f Dockerfile.engine -t gcr.io/resttlers/engine .
	docker push gcr.io/resttlers/engine
	gcloud app deploy app.engine.yaml --image-url=gcr.io/resttlers/engine --quiet

rest-api:
	docker build -f Dockerfile.rest-api -t gcr.io/resttlers/rest-api .
	docker push gcr.io/resttlers/rest-api
	gcloud app deploy app.rest-api.yaml --image-url=gcr.io/resttlers/rest-api --quiet

web-ui:
	docker build -f Dockerfile.web-ui -t gcr.io/resttlers/web-ui .
	docker push gcr.io/resttlers/web-ui
	gcloud app deploy app.web-ui.yaml --image-url=gcr.io/resttlers/web-ui --quiet