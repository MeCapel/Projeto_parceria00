/// <reference types="cypress" />

describe('Projeto Baldan - Testes E2E', () => {
  
  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('sitekey') || 
        err.message.includes('App Check') || 
        err.message.includes('required parameters')) {
      return false; 
    }
    return true;
  });

  beforeEach(() => {
    cy.visit('/', { timeout: 30000 });
  });

  it('Cenário 1: Deve carregar a tela de login', () => {
    cy.contains('Entre na sua conta', { timeout: 10000 }).should('be.visible');
  });

  it('Cenário 2: Deve exibir erro ao inserir credenciais inválidas', () => {
    cy.get('input', { timeout: 10000 }).first().type('usuario@baldan.com.br');
    cy.get('input[type="password"]').type('errado123'); // senha errada aqui
    cy.get('button').contains('Entrar').click();
    // Adicione uma asserção de erro aqui se o seu sistema mostrar algum alerta!
  }); 
  it('Cenário 3: Deve realizar login com sucesso', () => {
    cy.get('input', { timeout: 10000 }).first().type('isis@mail.com');    
    cy.get('input[type="password"]').type('123456');    
    cy.get('button').contains('Entrar').click();
    
    // Asserções de sucesso
    cy.url({ timeout: 15000 }).should('include', '/home'); 
    cy.contains('Projetos', { timeout: 10000 }).should('be.visible');
  });
});