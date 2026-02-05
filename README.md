# 📦 Sistema Web – Papelaria Criativa

Sistema web completo para gestão de produtos e vendas, desenvolvido como case simulado, com foco em boas práticas, clareza de regras de negócio e integração frontend ↔ backend.

## 🤖 Contexto do Projeto

Este projeto foi desenvolvido como um case, simulando um cenário real de um comércio fictício chamado "papelaria criativa" que necessita de:

- Controle de estoque

- Cadastro e edição de produtos

- Registro de vendas

- Relatório dos dados das vendas e função de exportar em PDF

O levantamento de requisitos foi feito de forma simulada, utilizando uma IA como stakeholder, permitindo validar regras de negócio, fluxos e decisões técnicas antes da implementação.

![Gif do levantamento de requisitos](docs/levantamentoRequisitos.gif)

## 📊 Objetivos

- Demonstrar domínio de C# com Minimal APIs

- Aplicar Entity Framework Core com SQL Server

- Implementar regras de negócio no backend

- Consumir API com JavaScript puro

- Manter o projeto simples, legível e defensável

## 👩‍💻 Tecnologias Utilizadas
### Backend:

- .NET 10 SDK

- C# – Minimal API

- Entity Framework Core

- SQL Server

- Swagger / OpenAPI

- QuestPDF (geração de relatórios em arquivo .PDF)

### Frontend

- HTML5

- CSS3

- JavaScript puro

- Consumo de API via fetch

- Manipulação direta do DOM (sem frameworks)

## Arquitetura Geral

- Backend responsável por toda a regra de negócio

- Frontend focado em exibição, interação e validações básicas

- Comunicação via JSON

- Separação clara de responsabilidades

## Funcionalidades
### Produtos

- Listagem de produtos

- Cadastro de novos produtos

- Edição de produtos existentes

- Exclusão de produtos existentes

### Validações de negócio:

- Nome obrigatório

- Quantidade não negativa

- Preço de venda maior que preço de custo

### Vendas

- Registro de vendas com múltiplos itens

- Validação de estoque disponível

- Atualização automática de quantidade em estoque

- Cálculo de totais por item e da venda

### Relatórios

- Geração de relatório de vendas em PDF

- Dados obtidos diretamente do banco

## Decisões Técnicas Importantes

- Uso de Minimal API para reduzir boilerplate e manter clareza

- Aplicação de AsNoTracking() em consultas somente leitura

- Regras críticas centralizadas no backend

- Frontend sem frameworks para evidenciar domínio de JS puro

- Tratamento de erros e respostas padronizadas

## Como Executar o Projeto

- Clone este repositório

- Configure a connection string no appsettings.json

- Execute o projeto com:
  
 dotnet run

- O banco será criado automaticamente via migrations

- Acesse:

Frontend: http://localhost:xxxx

Swagger: http://localhost:xxxx/swagger

(Swagger habilitado apenas em desenvolvimento)

## Considerações Finais

Este projeto tem como foco clareza, organização e boas práticas, evitando complexidade desnecessária.
Todas as decisões foram tomadas visando um cenário real de manutenção, leitura de código e evolução futura.

# Demonstração do sistema

![Gif demonstrativo do sistema](docs/demonstracao.gif)
