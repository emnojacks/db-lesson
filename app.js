require("dotenv").config()

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_DBNAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
    host: process.env.DB_HOST,
    dialect: "postgres"
});

//db associations (relationships) helps code look cleaner and more concise than blue badge

//create User Model & Table
const User = sequelize.define("User", {
    username: {
        type: DataTypes.STRING
    }
})

//1 to 1 Relationships
//create Profile Model & Table
const Profile = sequelize.define("Profile", {
    birthday: {
        type: DataTypes.DATE
    }
})

//with these we don't have to do user.findOne where user.id = reg.body.user.id
User.hasOne(Profile, {
    //if you delete the user, the profile will also be deleted 
onDelete: "CASCADE"
});
User.belongsTo(User);
    
    
//1 to Many Relationships

const Order = sequelize.define("Order", {
    shipDate: {
    type: DataTypes.DATE
    }
})

User.hasMany(Order);
Order.belongsTo(User);

// Many to Many Relationships

const Class = sequelize.define("Class", {
    className: {
    type: DataTypes.STRING
    },
    startDate: {
    type: DataTypes.DATE
    }
})

//creates Users_Classes Table
User.belongsToMany(Class, { through: "Users_Classes" });
Class.belongsToMany(User, { through: "Users_Classes" });
    

//DB authentication check - tests connection
    ;(async () => {
        await sequelize.sync({ force: true });
        
        let my_user = await User.create({
            username: "Em J"
        })
        let my_profile = await Profile.create({
        birthday: new Date()
        })
        console.log(await my_user.getProfile())
        my_user.setProfile(my_profile)
        console.log(await my_user.getProfile())
        
        let resultUser = await User.findOne({
            where: {
            id:1
            }
        })
        console.log(await resultUser.getProfile)
        
    })();
    //  try {
    //     await sequelize.authenticate();
    //     console.log('Connection has been established successfully.');
    // } catch (error) {
    //     console.error('Unable to connect to the database:', error);
    // }

