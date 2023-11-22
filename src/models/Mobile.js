const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Mobiles = sequelize.define("Mobiles", {
    UserID: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    SubCounty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Ward: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Market: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Mobiles;
};
