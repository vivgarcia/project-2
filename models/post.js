// This model will contain all of the posts made by users including as well as the timestamps

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    category: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });
  return Post;
};
