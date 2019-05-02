'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([
      queryInterface.addColumn(
        'Fixtures',
        'homeTeamScore',
        Sequelize.INTEGER
      ),
      queryInterface.addColumn(
        'Fixtures',
        'awayTeamScore',
        Sequelize.INTEGER
      ),
      queryInterface.addColumn(
        'Fixtures', 
        'matchDate', 
        Sequelize.DATE
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return Promise.all([
      queryInterface.removeColumn('Fixtures', 'homeTeamScore'),
      queryInterface.removeColumn('Fixtures', 'awayTeamScore'),
      queryInterface.removeColumn('Fixtures', 'matchDate')
    ]);
  }
};
