const express = require('express');
const router = express.Router();
const Category = require('../models/categories');
const ResUtil = require('../utils/res');

router.get('/', async (req, res) => {
    try {
        const data = await Category.aggregate([
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
        ResUtil.SUCCESS(req, res, { data }, "SUCCESS");
    } catch (error) {
        ResUtil.SERVER_ERROR(req, res, { message: error.message }, "ERROR");
    }
});

router.get('/:id', async(req, res)=>{
    const categoryId = req.params.id;
    try {
        const data = await Category.aggregate([
            {
                $match: {
                    id: categoryId
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
        ResUtil.SUCCESS(req, res, { data }, "SUCCESS");
    } catch (error) {
        ResUtil.SERVER_ERROR(req, res, { message: error.message }, "ERROR");
    }
});

router.get('/user/:id', async(req, res)=>{
    const userId = req.params.id;
    try {
        const data = await Category.aggregate([
            {
                $match: {
                    userId: userId
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
        ResUtil.SUCCESS(req, res, { data }, "SUCCESS");
    } catch (error) {
        ResUtil.SERVER_ERROR(req, res, { message: error.message }, "ERROR");
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body) {
            return ResUtil.VALIDATION_ERROR(req, res, { message: 'categories details is requried' }, 'VALIDATION_ERROR')
        }
        const newTask = new Category(req.body);
        const data = await newTask.save();
        ResUtil.SUCCESS(req, res, { data }, "SUCCESS")
    } catch (error) {
        ResUtil.SERVER_ERROR(req, res, { message: error.message }, "ERROR_ON_CREATE_CATEGORY")
    }
});

router.put('/:id', async (req, res) => {
    try {
        const data = await Category.findOneAndUpdate({id:req.params.id}, req.body, { new: true });
        if (!data) {
          return ResUtil.NOT_FOUND(req, res, { message: 'Category not found' }, 'ERROR')
        }
        ResUtil.SUCCESS(req, res, { data }, "SUCCESS")
      } catch (error) {
        ResUtil.SERVER_ERROR(req, res, { message: error.message }, "ERROR")
      }
});

router.delete('/:id', async (req, res) => {
    try {
        const data = await Category.findOneAndDelete({id:req.params.id});
        if (!data) {
          return ResUtil.VALIDATION_ERROR(req, res, { message: 'Category not found' }, 'ERROR')
        }
        ResUtil.SUCCESS(req, res, {}, "SUCCESS")
      } catch (error) {
        ResUtil.SERVER_ERROR(req, res, { message: error.message }, "ERROR")
      }
});

module.exports = router;