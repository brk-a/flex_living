.PHONY: start-backend start-frontend run-tests clean

start-backend:
	cd backend && npm start

start-frontend:
	cd frontend/flex_living_ui && npm run dev

run-tests:
	cd backend && npm test
# 	cd frontend/flex_living_ui && npm test

clean:
	rm -rf backend/node_modules frontend/node_modules