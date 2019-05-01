'use strict';
module.exports = (sequelize, DataTypes) => {
  const Fixture = sequelize.define('Fixture', {
    homeTeamId:  {
      type: DataTypes.INTEGER,
      references: {
        model: 'Team',
        key: 'id'
      },
    },
    awayTeamId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Team',
        key: 'id'
      },
    }
  }, {});
  Fixture.associate = function(models) {
    // associations can be defined here
  };
  return Fixture;
};