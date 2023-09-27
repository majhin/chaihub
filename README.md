# React + Vite

_How to setup the Project_ (nodejs and npm are required)

1. Clone the Repo or Download the .zip
2. Go to the directory in terminal and type > npm install
3. Configure .env.local, in the root directory and then add below two entries

VITE_SERVER_URL = "cornhub.ap-south-1.elasticbeanstalk.com"
VITE_SOCKET_URL = "cornhub.ap-south-1.elasticbeanstalk.com:40510"

4. Type _npm run dev_ and make sure the server is running on http://localhost:5173/

(This is the only URL configured at backend so no one bombards the server - AWS IS NOT CHEAP but we are :D)

Simple social media app where you can post, comment, like, share. Uses websockets from real time feed and notifications. UI inspiration taken from memes. You can register with GOOGLE LOGIN (Only Email and Name are store on server) or Create an account.

You can take a look at server code as well (https://github.com/majhin/cornhub) for any privacy concers regarding GOOGLE LOGIN.

DO LET ME KNOW FOR ANY ERRORS.

THANK YOU !!
