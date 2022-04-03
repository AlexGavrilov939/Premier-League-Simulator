include .env

######################################################## BUILD #########################################################

build: build-app

build-app: \
	--before-build-app \
	--build-app-source \
	--build-app \
	--build-php-fpm
	@echo "* OK"

--before-build-app:
	./scripts/before_build.sh ${IMAGE_TAG}

--build-app:
	docker build --pull -f ./docker/app/Dockerfile -t ${REGISTRY}/icl-app:${IMAGE_TAG} .

--build-app-source:
	docker build --pull -f ./docker/app-source/Dockerfile -t ${REGISTRY}/icl-app-source:${IMAGE_TAG} .

--build-php-fpm:
	docker build --pull -f ./docker/php-fpm/Dockerfile -t ${REGISTRY}/icl-service-php-fpm:${IMAGE_TAG} .

################################################ PUSH TO REMOTE REGISTRY ###############################################

push: \
	--before-push \
	--push-app \
	--push-app-source \
	--push-service-php-fpm \
	--after-push
	@echo "* OK"

--before-push:
	./scripts/before_push.sh ${IMAGE_TAG} ${MAKECMDGOALS}

--after-push:
	./scripts/after_push.sh ${IMAGE_TAG} ${MAKECMDGOALS}

--push-app:
	docker push ${REGISTRY}/icl-app:${IMAGE_TAG}

--push-app-source:
	docker push ${REGISTRY}/icl-app-source:${IMAGE_TAG}

--push-service-php-fpm:
	docker push ${REGISTRY}/icl-service-php-fpm:${IMAGE_TAG}

show-tags:
	./scripts/show_tags.sh


######################################################## DEPLOY ########################################################

--deploy-single:
	./scripts/deploy_single.sh "${HOST}" "${IMAGE_TAG}" "${COMPOSE_FILE}"

deploy:
	./scripts/deploy.sh "${HOST}" "${IMAGE_TAG}"
	@echo "* OK"


################################################ ANSIBLE SERVERS SETUP #################################################

ansible-show-hosts:
	@./scripts/helpers/deploy.sh resetVars
	args=$$(./scripts/helpers/deploy.sh getAnsibleArgs "${HOST}") && ansible all -m ping $$args
	@echo "* OK"

ansible-setup-ssh:
	@./scripts/helpers/deploy.sh confirmAnsibleSetup "${HOST}"
	@./scripts/helpers/deploy.sh setupHostsSshByPublicKey "${HOST}"
	@echo "* OK"

ansible-servers-setup:
	@./scripts/helpers/deploy.sh resetVars
	@./scripts/helpers/deploy.sh confirmAnsibleSetup "${HOST}"
	@./scripts/helpers/deploy.sh checkHostsPoolAvailability "${HOST}"
	args=$$(./scripts/helpers/deploy.sh getAnsibleArgs "${HOST}") && ansible-playbook provisioning/app.yml -vv $$args
	@echo "* OK"

ansible-docker-login:
	@./scripts/helpers/deploy.sh resetVars
	args=$$(./scripts/helpers/deploy.sh getAnsibleArgs "${HOST}") && ansible-playbook provisioning/docker-login.yml $$args
	@echo "* OK"
