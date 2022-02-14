# Use node lts image
FROM node:lts

# Update NPM
RUN npm i -g npm

# Install Dependencies
RUN apt update -y && apt install -y \
    zsh \
    curl \
    vim

# Clean up install
RUN apt clean -y

#This is the user id of the host.  To get this run `id -u`
ARG USER_ID
#This is the group id of the host.  To get this run `id -g`
ARG GROUP_ID

# Change default id of node user to prevent clashes
RUN groupmod -g 999 node && usermod -u 999 -g 999 node

# Delete node-user user and group if they already exist
RUN  if grep -c '^node-user:' /etc/passwd; then userdel -f node-user; fi
RUN if getent group node-user ; then groupdel node-user; fi

# Re-add node-user group and user using provided `USER_ID` & `GROUP_ID` args
RUN groupadd -g $GROUP_ID node-user
RUN useradd -d /home/node-user -s /bin/bash -u $USER_ID -g $GROUP_ID node-user

# Create home for node-user user and set permisions
RUN mkdir /home/node-user
RUN mkdir -p /home/node-user/.ssh
RUN chown -R node-user:node-user /home/node-user

# Set default user
USER node-user

# Install oh-my-zsh
RUN zsh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" || true

# Set app directory
WORKDIR /app
