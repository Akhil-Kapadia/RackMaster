.PHONY: help env env-root env-backend env-frontend install-backend migrate run-backend install-frontend run-frontend docker-up docker-down build test-backend test-frontend

-include Makefile.win

# Auto-detect PowerShell and map standard targets to Windows PowerShell targets
# Detection uses the PSModulePath environment variable which PowerShell sets for child processes.
ifdef PSModulePath
install-backend: win-install-backend
migrate: win-migrate
run-backend: win-run-backend
install-frontend: win-install-frontend
run-frontend: win-run-frontend
docker-up: win-docker-up
docker-down: win-docker-down
build: win-build
test-backend: win-test-backend
test-frontend: win-test-frontend
env: win-env
help: win-help
endif

SHELL := /bin/bash

help:
	@echo "Makefile commands:"
	@echo "  make env              # create .env files from examples if missing"
	@echo "  make install-backend  # create venv and install backend deps"
	@echo "  make migrate          # run Django migrations"
	@echo "  make run-backend      # run Django dev server"
	@echo "  make install-frontend # install frontend npm deps"
	@echo "  make run-frontend     # run React dev server"
	@echo "  make docker-up        # docker-compose up --build"
	@echo "  make docker-down      # docker-compose down"
	@echo "  make test-backend     # run backend tests"
	@echo "  make test-frontend    # run frontend tests"

env:
	@echo "Creating env files from examples where missing..."
	@[ -f .env ] || cp .env.example .env
	@[ -f backend/.env ] || cp backend/.env.example backend/.env
	@[ -f frontend/.env ] || cp frontend/.env.example frontend/.env
	@echo "Done. Edit the .env files as needed."


install-backend:
	@echo "Setting up server virtualenv and installing requirements..."
	cd server && python -m venv .venv
	@echo "Activate the virtualenv then run 'make migrate' and 'make run-backend'"

migrate:
	@echo "Running Django migrations (requires activated server venv)..."
	cd server && . .venv/bin/activate && python manage.py migrate

run-backend:
	@echo "Starting Django dev server (requires activated server venv)..."
	cd server && . .venv/bin/activate && python manage.py runserver 127.0.0.1:8000

install-frontend:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

run-frontend:
	@echo "Starting React dev server..."
	cd frontend && npm start

docker-up:
	@echo "Starting services with docker-compose..."
	docker-compose up --build

docker-down:
	@echo "Stopping services..."
	docker-compose down

build:
	@echo "Building both services with docker-compose..."
	docker-compose build

test-backend:
	@echo "Running backend tests (requires activated backend venv)..."
	cd backend && . .venv/bin/activate && python manage.py test

test-frontend:
	@echo "Running frontend tests..."
	cd frontend && npm test --silent
