# Description: Dockerfile for the Frontend
# Stage 1
FROM node:20.04

WORKDIR /Frontend
COPY package.json .
RUN npm install
COPY . .

ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

#NGIX

FROM nginx:1.21.3-redhat

COPY --from=build-stage /Frontend/dist /usr/share/nginx/html
EXPOSE $REACT_DOCKER_PORT

CMD ["nginx", "-g", "daemon off;"]