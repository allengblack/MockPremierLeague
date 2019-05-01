'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert('Teams', 
    [{ 
      name: 'Chelsea FC',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }, 
    {
      name: 'Bolton Wanderers FC',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }, 
    {
      name: 'Kano Pillars',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    },
    {
      name: 'Leeds United FC',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }],
    {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('Teams', null, {});
  }
};
