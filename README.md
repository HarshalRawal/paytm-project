<!-- create the volumes for the different backends (only once) -->
docker volume create api-gateway-data
docker volume create top-up-server-data
docker volume create bank-data
docker volume create bank-web-hook-server-data
docker volume create payment-data
docker volume create wallet-data

<!-- docker commands to create a container  -->
# api-gateway Postgres container running on port 8000
docker run -d \
  --name api-gateway-db \
  -p 8000:5432 \
  -v api-gateway-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=api_user \
  -e POSTGRES_PASSWORD=api_password \
  -e POSTGRES_DB=api_gateway_db \
  postgres

# top-up-server Postgres container running on port 3001
docker run -d \
  --name top-up-server-db \
  -p 3001:5432 \
  -v top-up-server-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=topup_user \
  -e POSTGRES_PASSWORD=topup_password \
  -e POSTGRES_DB=top_up_server_db \
  postgres

# bank Postgres container running on port 4002
docker run -d \
  --name bank-db \
  -p 4002:5432 \
  -v bank-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=bank_user \
  -e POSTGRES_PASSWORD=bank_password \
  -e POSTGRES_DB=bank_db \
  postgres

# bank-web-hook-server Postgres container running on port 5001
docker run -d \
  --name bank-web-hook-server-db \
  -p 5001:5432 \
  -v bank-web-hook-server-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=webhook_user \
  -e POSTGRES_PASSWORD=webhook_password \
  -e POSTGRES_DB=bank_web_hook_server_db \
  postgres

# payment Postgres container running on port 3002
docker run -d \
  --name payment-db \
  -p 3002:5432 \
  -v payment-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=payment_user \
  -e POSTGRES_PASSWORD=payment_password \
  -e POSTGRES_DB=payment_db \
  postgres

# wallet Postgres container running on port 8085
docker run -d \
  --name wallet-db \
  -p 8085:5432 \
  -v wallet-data:/var/lib/postgresql/data \
  -e POSTGRES_USER=wallet_user \
  -e POSTGRES_PASSWORD=wallet_password \
  -e POSTGRES_DB=wallet_db \
  postgres



  <!-- database urls  -->
  # api-gateway .env
  <!-- api-gate , bank not needed -->
DATABASE_URL=postgresql://api_user:api_password@localhost:8000/api_gateway_db 

# top-up-server .env
DATABASE_URL=postgresql://topup_user:topup_password@localhost:3001/top_up_server_db

# bank .env
DATABASE_URL=postgresql://bank_user:bank_password@localhost:4002/bank_db

# bank-web-hook-server .env
DATABASE_URL=postgresql://webhook_user:webhook_password@localhost:5001/bank_web_hook_server_db

# payment .env
DATABASE_URL=postgresql://payment_user:payment_password@localhost:3002/payment_db

# wallet .env
DATABASE_URL=postgresql://wallet_user:wallet_password@localhost:8085/wallet_db