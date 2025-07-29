FROM node:20-alpine as build
#→ É a versão do Node.js que vamos instalar dentro do nosso contêiner, para que consigamos instalar as dependências e executar os comandos;

WORKDIR /app
#→ É o diretório de trabalho do contêiner, o sistema operacional do contêiner é Linux, então os caminhos dentro do Linux são assim, eles começam com / diferente do Windows que é C:

COPY package*.json ./
#→ Copia o arquivo de dependências para dentro o contêiner e o . significa o diretório atual, pois o arquivo Dockerfile está no mesmo nível do package.json;

RUN npm install
#→ Instala as dependências necessárias para que o projeto possa funcionar com todas as bibliotecas que tem instaladas nele;

COPY . . 
#→ Copia todo o código para dentro do contêiner, o . serve para referenciar o diretório atual;

RUN npx prisma generate

RUN npm run build

EXPOSE 3000
#→ Expõe a porta que a aplicação usa;

CMD ["node", "dist/server.js"]
#→ É o comando para iniciar/rodar a nossa aplicação