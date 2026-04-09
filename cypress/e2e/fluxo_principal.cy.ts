/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="cypress" />

Cypress.on('uncaught:exception', (_err, _runnable) => {
  return false;
});

describe('Projeto Baldan - Testes E2E', () => {
  
  // Antes de cada teste, visita a página inicial
  beforeEach(() => {
    cy.visit('/');
  });

  it('Cenário 1: Deve carregar a tela de login', () => {
    // Valida se o título ou algum texto da Baldan aparece
    cy.contains('Membros').should('be.visible'); 
  });

  it('Cenário 2: Deve exibir erro com credenciais inválidas', () => {
    // Tenta logar com dados errados para validar o erro
    cy.get('input[name="email"]').type('errado@baldan.com.br');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();
    
    // Verifica se o sistema barrou (ajuste o seletor conforme seu sistema de alerta)
    cy.get('.toast-error').should('be.visible'); 
  });

  it('Cenário 3: Navegação entre abas', () => {
    // Simula o clique em "Gerenciar membros" que a gente corrigiu 
    cy.contains('Gerenciar membros').click();
    cy.contains('Projeto').should('be.visible');
  });
});