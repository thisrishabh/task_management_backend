const express = require('express');
const router = express.Router();
const Task = require('../models/tasks');
const ResUtil = require('../utils/res');

router.get('/', async (req, res) => {
    try {
        const data = await Task.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "id",
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "id",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]);
        if (!data) {
            return ResUtil.NOT_FOUND(req, res, { message: 'No tasks found' }, 'ERROR')
        }
        ResUtil.SUCCESS(req, res, { data }, "SUCCESS")
    } catch (error) {
        ResUtil.SERVER_ERROR(req, res, { message: error.message }, "ERROR")
    }
})

router.get('/user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const data = await Task.aggregate([
            {
                $match: {
                    userId: userId,
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "id",
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "id",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]);
        if (!data) {
            return ResUtil.NOT_FOUND(req, res, { message: 'No tasks found' }, 'ERROR')
        }
        ResUtil.SUCCESS(req, res, { data }, "SUCCESS")
    } catch (error) {
        ResUtil.SERVER_ERROR(req, res, { message: error.message }, "ERROR")
    }
})

router.post('/', async (req, res) => {
    try {
        if (!req.body) {
            return ResUtil.VALIDATION_ERROR(req, res, { message: 'task details is requried' }, 'VALIDATION_ERROR')
        }
        const newTask = new Task(req.body);
        const data = await newTask.save();
        ResUtil.SUCCESS(req, res, { data }, "SUCCESS")
    } catch (error) {
        ResUtil.SERVER_ERROR(req, res, { message: error.message }, "ERROR_ON_CREATE_TASK")
    }
});

router.get('/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const data = await Task.aggregate([
            {
                $match: {
                    id: taskId
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "id",
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "category",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "id",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "user",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]);
        if (!data) {
            return ResUtil.NOT_FOUND(req, res, { message: 'No tasks found' }, 'ERROR')
        }
        ResUtil.SUCCESS(req, res, { data }, "SUCCESS")
    } catch (error) {
        ResUtil.SERVER_ERROR(req, res, { message: error.message }, "ERROR")
    }
});

router.put('/:id', async (req, res) => {
    try {
        const data = await Task.findOneAndUpdate({id:req.params.id}, req.body, { new: true });
        if (!data) {
          return ResUtil.NOT_FOUND(req, res, { message: 'Task not found' }, 'ERROR')
        }
        ResUtil.SUCCESS(req, res, { data }, "SUCCESS")
      } catch (error) {
        ResUtil.SERVER_ERROR(req, res, { message: error.message }, "ERROR")
      }
});

router.delete('/:id', async (req, res) => {
    try {
        const data = await Task.findOneAndDelete({id:req.params.id});
        if (!data) {
          return ResUtil.VALIDATION_ERROR(req, res, { message: 'Task not found' }, 'ERROR')
        }
        ResUtil.SUCCESS(req, res, {}, "SUCCESS")
      } catch (error) {
        ResUtil.SERVER_ERROR(req, res, { message: error.message }, "ERROR")
      }
});

module.exports = router;