describe('Hacker stories', () => {
    const initialTerm = 'React'
    const newTerm = 'Cypress'

    context('Hiting the real API', ()=>{

        beforeEach(()=> {
            cy.intercept({
                method: 'GET',
                pathname: '**/search',
                query:{
                    query: initialTerm,
                    page:'0'
                }
            }).as('getStories')
            cy.visit('/')
            cy.wait('@getStories')
        })
        it('shows 20 stories, then the next 20 after clicking "More"', ()=>{

            cy.intercept({
                method: 'GET',
                pathname: '**/search',
                query:{
                    query: initialTerm,
                    page: '1'
                }
            }).as('getNextStories')
            cy.get('.item').should('have.length', 20) 
            cy.contains('More').click()
            cy.wait('@getNextStories')
            cy.get('.item').should('have.length', 40)
        })
        it('searches via the last searched term', ()=> {

            cy.intercept(
                'GET',
                `**/search?query=${newTerm}&page=0`
            ).as('getNewTermStories')

            cy.get('#search').should('be.visible')
                .clear().type(`${newTerm}{enter}`)
            cy.wait('@getNewTermStories')

            cy.getLocalStorage('search').should('be.equal', newTerm)
            //pega o botão com texto = initialTerm, verifica se esta visivel e clica nele
            cy.get(`button:contains(${initialTerm})`).should('be.visible').click()
            
            cy.wait('@getStories')
            cy.getLocalStorage('search').should('be.equal', initialTerm)
            cy.get('.item').should('have.length', 20)

            cy.get('.item').first().should('be.visible').and('contain', initialTerm)

            cy.get(`button:contains(${newTerm})`).should('be.visible')
        })
    })

    beforeEach(()=> {
        //Intercept como objeto e contendo a query com suas propriedades.
        cy.intercept({
            method: 'GET',
            pathname: '**/search',
            query:{
                query:initialTerm,
                page:'0'
            }
        }).as('getStories')
        cy.visit('/')
        cy.wait('@getStories')
    })

    it('shows the footer', ()=>{
        cy.get('footer').should('be.visible')
            .and('contain', 'Icons made by Freepik from www.flaticon.com')
    })

    context('List of stories', ()=>{
        
        it.skip('shows the right data for all rendered stories', ()=>{

        })



        it('shows only nineteen stories after dimissing the first story', ()=>{
            cy.get('.button-small')
            .first()
            .click()

            cy.get('.item').should('have.length', 19)
        })

    })

    context.skip('Order by', () => {
        it('orders by title', () => {})
  
        it('orders by author', () => {})
  
        it('orders by comments', () => {})
  
        it('orders by points', () => {})
    })

    context('Errors', ()=> {
        /*  Podemos usar o comando cy.intercept para simular falhas na rede/servidor. 
            Passando atributos como { statusCode: 500 } ou  { forceNetworkError: true } dentro do intercept
        */
        it('shows "Something went wrong ..." in case of a server error', () => {

            cy.intercept(
                'GET',
                '**/search**',
                { statusCode: 500 }
            ).as('getInternalServerError')
            cy.visit('/')
            cy.wait('@getInternalServerError')
            cy.get('p:contains(Something went wrong ...)').should('be.visible')
        })
        
        it('shows "Something went wrong ..." in case of a network error', () => {
            // Cypress está abortando a requisição HTTP para simular o erro de rede.
            cy.intercept(
                'GET',
                '**/search**',
                { forceNetworkError: true }
            ).as('getNetworkError')
            cy.visit('/')
      
            cy.wait('@getNetworkError')
            cy.get('p:contains(Something went wrong ...)').should('be.visible')
        })
    })
    
    context('Search', ()=>{

        beforeEach(()=> {

            cy.intercept(
                'GET',
                `**/search?query=${newTerm}&page=0`
            ).as('getNewTermStories')

            cy.get('#search').clear()
        })

        it('types and hits ENTER', () => {
            
            cy.get('#search').type(`${newTerm}{enter}`)
      
            cy.wait('@getNewTermStories')
      
            cy.get('.item').should('have.length', 20)
            cy.get('.item')
                .first()
                .should('contain', newTerm)
            cy.get(`button:contains(${initialTerm})`)
                .should('be.visible')
          })
      
        it('types and clicks the submit button', () => {
            cy.get('#search')
                .type(newTerm)
            cy.contains('Submit')
                .click()
      
            cy.wait('@getNewTermStories')
      
            cy.get('.item').should('have.length', 20)
            cy.get('.item')
                .first()
                .should('contain', newTerm)
            cy.get(`button:contains(${initialTerm})`)
                .should('be.visible')
        })
        //esse teste 'types and submits the form directly' não é e2e pois não é algo que o usuário pode fazer. 
        it.skip('types and submits the form directly', ()=>{
            cy.get('form input[type="text"]').should('be.visible')
                .clear().type(newTerm)
            cy.get('form').submit()
            
            cy.wait('@getNewTermStories')
            cy.get('.item').should('have.length', 20)

        })
    })

    context('Last searches', ()=>{

        Cypress._.times(3, ()=>{
            it('shows a max of 5 buttons for the last searched terms', ()=>{
                const faker = require('faker')
    
                cy.intercept(
                    'GET',
                    '**/search**'
                ).as('getRandomStories')
    
    
                Cypress._.times(6 , ()=>{
                    const randomWord = faker.random.word()
                    cy.get('#search').clear().type(`${randomWord} {enter}`)
                    cy.wait('@getRandomStories')
                })
    
                cy.get('.last-searches button').should('have.length', 5);
            }) 
        })
    })
})