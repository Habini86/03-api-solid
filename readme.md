# App

Gympass Style App.

# Setup

## Start
```sh
docker compose up -d
```

## Stop
```sh
docker compose stop
```

## RFs (Requisitos Funcionais)

- [x] Deve ser possível cadastrar-se
- [x] Deve ser possível autenticar-se
- [x] Deve ser possível obter o perfil de um usuário autenticado
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário autenticado
- [x] Deve ser possível o usuário obter seu histórico de check-ins
- [x] Deve ser possível o usuário buscar academias próximas (até 10km)
- [x] Deve ser possível o usuário buscar academias pelo nome
- [x] Deve ser possível o usuário realizar check-in em uma academia
- [x] Deve ser possível validar o check-in de um usuário
- [x] Deve ser possível cadastrar uma academia

## RNs (Regras de Negócio)

- [x] O usuário não deve poder cadastrar-se com um e-mail duplicado
- [x] O usuário não pode fazer 2 check-ins no mesmo dia
- [X] O usuário não pode fazer check-in se não estiver perto (100m) da academia
- [x] O check-in só pode ser validado até 20 minutos após sua criação
- [ ] O check-in só pode ser validado por administradores
- [ ] A academia só pode ser cadastrada por administradores

## RNFs (Requisitos Não Funcionais)

- [x] A senha do usuário precisa estar criptografada
- [x] Os dados da aplicação precisam estar persistidos em um banco de dados PostgreSQL
- [x] Todas as listas de dados precisam estar paginadas com 20 itens por página
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token)