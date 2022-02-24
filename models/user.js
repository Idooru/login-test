const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                email: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    unique: true,
                },
                password: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                nick: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    unique: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                paranoid: false,
                modelName: "User",
                tableName: "users",
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
};
