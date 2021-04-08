//================Libraries=============================//
const express = require('express')
const index = express()
const fs = require('fs')
const PORT = 8000 // 8000 Port will run in this project
const DataBase = './data/TaskDatas.json' // giving variable in Diractory of TaskDatas.json


//================Assets============================//
index.set('view engine', 'pug')
index.use('/static', express.static('public'))
index.use(express.urlencoded({ extended: false }))


//==================Logic programming===============

// in this part I will do add and delete operations
index.get('/', (req, res) => {
    fs.readFile(DataBase, (err, data) => {
        if (err) throw err

        const TaskDatas = JSON.parse(data)

        res.render('home', { TaskDatas: TaskDatas })
    })
})

index.post('/add', (req, res) => {
    const formData = req.body

    if (formData.TaskData.trim() == '') {
        fs.readFile(DataBase, (err, data) => {
            if (err) throw err

            const TaskDatas = JSON.parse(data)

            res.render('home', { wrong: true, TaskDatas: TaskDatas })
        })
    } else {
        fs.readFile(DataBase, (err, data) => {
            if (err) throw err

            const TaskDatas = JSON.parse(data)

            const TaskData = {
                id: id(),
                description: formData.TaskData,
                adding: false
            }

            TaskDatas.push(TaskData)

            fs.writeFile(DataBase, JSON.stringify(TaskDatas), (err) => {
                if (err) throw err

                fs.readFile(DataBase, (err, data) => {
                    if (err) throw err

                    const TaskDatas = JSON.parse(data)

                    res.render('home', { add: true, TaskDatas: TaskDatas })
                })
            })
        })
    }
})

index.get('/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile(DataBase, (err, data) => {
        if (err) throw err

        const TaskDatas = JSON.parse(data)

        const CleanedTaskDatas = TaskDatas.filter(TaskData => TaskData.id != id)

        fs.writeFile(DataBase, JSON.stringify(CleanedTaskDatas), (err) => {
            if (err) throw err

            res.render('home', { TaskDatas: CleanedTaskDatas, fail: true })
        })
    })
})


index.get('/:id/update', (req, res) => {
    const id = req.params.id

    fs.readFile(DataBase, (err, data) => {
        if (err) throw err

        const TaskDatas = JSON.parse(data)
        const TaskData = TaskDatas.filter(TaskData => TaskData.id == id)[0]

        const TaskDataId = TaskDatas.indexOf(TaskData)
        const OrderedTaskData = TaskDatas.splice(TaskDataId, 1)[0]

        OrderedTaskData.adding = true

        TaskDatas.push(OrderedTaskData)

        fs.writeFile(DataBase, JSON.stringify(TaskDatas), (err) => {
            if (err) throw err

            res.render('home', { TaskDatas: TaskDatas })
        })
    })

})

index.listen(PORT, (err) => {
    if (err) throw err

    console.log(`Project is running on port ${PORT}`) // Instead of Port there will be 6000
})


function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
}