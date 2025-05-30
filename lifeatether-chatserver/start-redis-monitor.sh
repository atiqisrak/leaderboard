#!/bin/bash

# Kill any existing redis-commander process
pkill -f redis-commander

# Start redis-commander with our config
redis-commander --config redis-commander.json &

echo "Redis Commander started!"
echo "Access the dashboard at: http://localhost:8081"
echo "Username: admin"
echo "Password: ethertech" 