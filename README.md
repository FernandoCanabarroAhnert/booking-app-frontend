# Projeto Full Stack: Site para Gerenciamento de Reservas 🏨 (front-end)

![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![RxJS](https://img.shields.io/badge/rxjs-%23B7178C.svg?style=for-the-badge&logo=reactivex&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E44D26?style=for-the-badge&logo=html5&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)

## O que é o projeto? 🤔

Este repositório é o front-end de um projeto Full Stack para um site de gerenciamento de reservas, que possui as seguintes funcionalidades: Login e Cadastro de Usuários, bem como Recuperação de Senha. Visualização de Quartos em grid com opção de filtro com várias opções, e Visualização de Quarto por Id. Visualização de Hotéis em grid e Visualização de Hotel por Id. Criar uma reserva em um quarto, com 4 formas de pagamento: Dinheiro, Pix, Cartão de Crédito e Boleto, sendo possível imprimir o boleto no momento de criação da reserva em formato PDF.

No momento da seleção da data de check-in e check-out, as datas em que o quarto está ocupado estarão bloqueadas ao usuário, impedindo-o de selecionar uma data inválida. O usuário pode também alterar seus dados pessoais e sua senha, adicionar e remover cartões de crédito, visualizar suas reservas, bem como adicionar, visualizar, atualizar e remover avaliações.

A parte de Gerenciamento conta com um CRUD de quartos, hotéis, reservas e usuários, e uma tela de dashboard que contém estatísticas sobre reservas, dependendo de quem está acessando a parte de gerenciamento. Caso seja um administrador/gerente, ele tem acesso total as funcionalidades de gerenciamento, podendo visualizar dados de todos os hotéis e quartos e gerar relatórios em formato PDF e Excel para cada domínio, e as estatísticas de seu Dashboard serão as estatísticas gerais de todos os hoteís. Caso seja um funcionário, todos os dados serão relativos ao hotel em que trabalha (quartos e reservas), e ele não poderá gerar relatórios.

O projeto foi feito com Angular e TypeScript, contando com SCSS para a estilização dos componentesm TailwindCSS para a responsividade e Angular Material como lib de componentes. Além disso, há uma pipeline CI/CD com Github Actions, que faz o deploy no OCI (Oracle Cloud Infrastructure) com o Traefik, permitindo o uso de domínios próprios (que nesse caso foi o fernandocanabarrodev.tech) e o uso de HTTPS, tanto para o Front-end quanto para o Back-end

## Imagens da interface

![Image](https://github.com/user-attachments/assets/3df729f9-4cc1-4a09-8ed0-f7940c9cf9e9)

![Image](https://github.com/user-attachments/assets/82e16bca-c63b-4588-86bd-56a31a06bb48)

![Image](https://github.com/user-attachments/assets/4085a15d-e355-4bc2-b25a-998edc2ad5c0)

![Image](https://github.com/user-attachments/assets/323cf215-c5de-4cac-82bd-b34d72dd2749)

![Image](https://github.com/user-attachments/assets/64336855-7503-4b21-a5d4-f6fab3ee2d91)

## Como executar 🎉

1.Clonar repositório git:

```text
git clone https://github.com/FernandoCanabarroAhnert/booking-app-frontend.git
```

2.Instalar dependências.

```text
npm install
```

3.Executar

```text
ng serve
```
