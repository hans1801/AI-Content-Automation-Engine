.PHONY: api ui ui-install

api:
	poetry run uvicorn api.server:app --reload --port 8000

ui:
	cd frontend && npm run dev

ui-install:
	cd frontend && npm install
