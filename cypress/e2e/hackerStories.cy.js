import {faker} from '@faker-js/faker';

describe('Hacker stories', () => {

    beforeEach(()=> {

        cy.intercept({
            method: 'GET',
            pathname: '**/search',
            query:{
                query:'React',
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
        it('shows 20 stories, then the next 20 after clicking "More"', ()=>{
            cy.get('.item').should('have.length', 20)
            
            cy.contains('More').click()

            cy.assertLoadingIsShownAndHidden()
            cy.get('.item').should('have.length', 40)
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

    context.skip('Errors', ()=> {

        it('shows "Something went wrong ..." in case of a server error', () => {})

        it('shows "Something went wrong ..." in case of a network error', () => {})
    })
    
    context('Search', ()=>{
        const initialTerm = 'React'
        const newTerm = 'Cypress'

        beforeEach(()=> {
            cy.get('#search').clear()
        })
        it('types and hits ENTER', () => {
            cy.get('#search')
                .type(`${newTerm}{enter}`)
      
            cy.assertLoadingIsShownAndHidden()
      
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
      
            cy.assertLoadingIsShownAndHidden()
      
            cy.get('.item').should('have.length', 20)
            cy.get('.item')
                .first()
                .should('contain', newTerm)
            cy.get(`button:contains(${initialTerm})`)
                .should('be.visible')
          })
    })

    context('Last searches', ()=>{

        const initialTerm = 'React'
        const newTerm = 'Cypress'

        it('searches via the last searched term', ()=> {
            cy.get('#search').type(`${newTerm}{enter}`)
            cy.assertLoadingIsShownAndHidden()
            cy.get(`button:contains(${initialTerm})`).should('be.visible').click()
            cy.assertLoadingIsShownAndHidden()
            cy.get('.item').should('have.length', 20)
            cy.get('.item').first().should('contain', initialTerm)
            cy.get(`button:contains(${newTerm})`).should('be.visible')
        })
        it.skip('shows a max of 5 buttons for the last searched terms', ()=>{
            //const faker = require('faker')

            Cypress._.times(6 , ()=>{
                cy.get('#search').clear().type(`${faker.random.word()}{enter}`)
            })
            cy.assertLoadingIsShownAndHidden()
            cy.get('.last-searches button').should('have.length', 5);
        })
    })
})