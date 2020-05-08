// This model will hold all of the categories created by users as well as their info retrieved from IGDB

module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define("Category", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    platforms: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });
  return Category;
};
