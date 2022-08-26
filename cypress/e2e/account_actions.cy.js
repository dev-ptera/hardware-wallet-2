describe('Account Actions', () => {

    const address1 = 'ban_1z7rxmcwataoqahha6xdo3j1tfikoufkhb95dg4b7aajapa4cnp6h3s9f8oj';
    const address2 = 'ban_1g98o6q1sidjbgo7gnqkobz1byo6tufjtt34n7prm6mbhcw914a9bgtkp584';
    const LOW_FUND_SEED = '727A5E960F6189BBF196D84A6B7715D0A78DE82AC15BBDB340540076768CDB31';
    const root = 'http://localhost:4200'
    const loadInitialAccount = 'loadInitialAccount';

    beforeEach(() => {
        // Cypress starts out with a blank slate for each test
        // so we must tell it to visit our website with the `cy.visit()` command.
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test
        cy.intercept(root).as('home');
        cy.visit(root);
        cy.wait('@home'); // once the route resolves, cy.wait will resolve as well
        cy.get('[data-cy=enter-secret]').click();
        cy.get('[data-cy=secret-input]').type(LOW_FUND_SEED);
        cy.get('[data-cy=secret-next]').click();
        cy.intercept({method: 'POST', url: '**', times: 3}).as(loadInitialAccount);
        cy.get('[data-cy=secret-next]').click();
        cy.intercept({ method: 'POST', url: '**/account/confirmed-transactions' }).as('confirmedTx');
        cy.get('[data-cy=dashboard-account-list]').find('.blui-info-list-item').click();
        cy.wait('@confirmedTx').then(() => {
            cy.get('[data-cy=account-scroll-container]').find('.blui-info-list-item').its('length').should('be.gte', 2);
        })
    })

    describe('Change Representative', () => {
        it('should close the change representative overlay', () => {
            cy.get('[data-cy=change-action-desktop]').click();
            cy.get('.change-rep-overlay');
            cy.get('[data-cy=change-close-button]').click();
            cy.get('.change-rep-overlay').should('not.exist');
        });
    })
});
