const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

const { create } = require('domain');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('ucheba', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

const UserDan = sequelize.define('UserDan', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photo_id: {
        type: DataTypes.STRING,
    },
    birthday: {
        type: DataTypes.DATE,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: true
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    }
}, {
    tableName: 'usersdan'
});

app.get('/usersdan', async (req, res) => {
    const usersdan = await UserDan.findAll({})
    res.status(201).json({
        data: usersdan,
        meta: {
            page: 1,
            per_page: 10,
            totalItems: usersdan.length
        }
    })
});


//вывод данных
app.get('/usersdan/:id', async (req, res) => {
    const usersdan= await UserDan.findByPk(req.params.id);
    res.status(201).json(usersdan);
});

//добавление данных
app.post('/usersdan', async (req, res) => {
    try {
        const usersdan = await UserDan.create(req.body);
        await usersdan.reload();
        return res.status(201).json(usersdan);
    } catch (e) {
        return res.json(e);
    }
});


//изменение данных
app.patch('/usersdan/:id', async (req, res) => {
    try {
        const usersdan = await UserDan.findByPk(req.params.id);
        if (usersdan) {
            usersdan.first_name=req.body.first_name;
            usersdan.last_name=req.body.last_name;
        }
        await usersdan.save();
        return res.status(200).json(usersdan);
    } catch (e) {
        return res.json(e);
    }
});

//удаление данных
app.delete('/usersdan/:id', async (req, res) => {
    try {
        const usersdan = await UserDan.findByPk(req.params.id);
        await usersdan.destroy();
        return res.status(204).json();
    } catch (e) {
        return res.json(e);
    }
});

app.listen(port, async () => {
    try {
        await UserDan.sync({
            alter: true,
            force: false
        });

    } catch (error) {
        console.error(error);
    }
})