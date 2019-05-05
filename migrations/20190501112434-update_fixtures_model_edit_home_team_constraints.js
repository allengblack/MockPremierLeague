'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return queryInterface.sequelize.transaction((t) => {
        return Promise.all([
            queryInterface.addConstraint("Fixtures", ["homeTeamId"], {
              type: "foreign key",
              name: "home_team_constraint",
              references: { //Required field
                table: "Teams",
                field: "id"
              }
            }, { transaction: t }),
            queryInterface.addConstraint("Fixtures", ["awayTeamId"], {
              type: "foreign key",
              name: "away_team_constraint",
              references: { //Required field
                table: "Teams",
                field: "id"
              }
            }, { transaction: t })
        ])
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return queryInterface.sequelize.transaction((t) => {
        return Promise.all([
          queryInterface.removeConstraint('Fixtures', 'home_team_constraint', { transaction: t }),
          queryInterface.removeConstraint('Fixtures', 'away_team_constraint', { transaction: t })
        ]);
    });
  }
};
