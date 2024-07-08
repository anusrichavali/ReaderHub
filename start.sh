echo "starting backend server"
cd server
PORT=3000 node server.js &  
BACKEND_PID=$! 

cd .. 

echo "starting frontend server"
cd readerhub
PORT=3001 npm start & 
FRONTEND_PID=$!

wait $BACKEND_PID $FRONTEND_PID