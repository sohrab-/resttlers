.PHONY: build tag push deploy update-routing

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
	gcloud app deploy app.engine.yaml --image-url=gcr.io/resttlers/engine  --quiet &
	gcloud app deploy app.rest-api.yaml --image-url=gcr.io/resttlers/rest-api  --quiet &
	gcloud app deploy app.web-ui.yaml --image-url=gcr.io/resttlers/web-ui  --quiet &
	wait

update-routing:
	gcloud app deploy dispatch.yaml