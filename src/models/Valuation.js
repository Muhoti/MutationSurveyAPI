const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Valuation = sequelize.define("Valuation", {
    ValuationID: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    SubCounty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Ward: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Market: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    OwnerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    NationalID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    NewPlotNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    LR_Number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Tenure: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    LandUse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Length: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Width: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Area: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Unit_of_Area: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Rate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    SiteValue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ParcelNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Latitude: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    Longitude: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    PropertyID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    FirstApprover: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    SecondApprover: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    FieldOfficer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Valuation;
};
