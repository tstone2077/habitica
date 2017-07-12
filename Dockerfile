FROM node:boron

# Install global packages
RUN npm install -g gulp grunt-cli bower mocha

# Clone Habitica repo and install dependencies
RUN mkdir -p /usr/src/habitrpg
WORKDIR /usr/src/habitrpg

RUN apt-get update && apt-get install -y apt-transport-https
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" >> /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn && rm -rf /var/lib/apt/lists/* && apt-get clean

#RUN git clone https://github.com/HabitRPG/habitica.git /usr/src/habitrpg
#RUN npm install
#RUN bower install --allow-root

# Create Build dir
RUN mkdir -p ./website/build

# Start Habitica
EXPOSE 3000
CMD ["yarn", "start"]
