describe('Funcionalidade de Autenticação', () => {
  it('Deve carregar a página de login com sucesso', () => {
    cy.visit('/'); // Visita a URL base
    cy.contains('Projeto').should('be.visible'); // Verifica se o texto do seu projeto aparece
  });

  it('Deve exibir erro ao inserir credenciais inválidas', () => {
    cy.visit('/');
    // Ajuste os nomes dos campos se forem diferentes no seu formulário
    cy.get('input[name="email"]').type('invalido@teste.com');
    cy.get('input[name="password"]').type('errada123');
    cy.get('button[type="submit"]').click();
    
    // Verifica se alguma mensagem de erro aparece
    cy.contains('Erro').should('be.visible'); 
  });
});