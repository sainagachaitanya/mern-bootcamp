import Bootcamp from "../models/Bootcamp.js";
import AsyncHander from "../middleware/AsyncHandler.js"
import ErrorResponse from "../utils/ErrorResponse.js"

export const GetAll = AsyncHander(async (req, res, next) => {

    let query;

    const req_query = {...req.query};
    const remove_fields = ["sort"];
    remove_fields.forEach(value => delete req_query[value]);

    let query_str = JSON.stringify(req_query)
    query_str = query_str.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

    query = Bootcamp.find(JSON.parse(query_str));

    if(req.query.sort) {
        const sort_by_array = req.query.sort.split(",");
        const sort_by_str = sort_by_array.join(" ");
        query = query.sort(sort_by_str)
    } else {
        query = query.sort('-price')
    }

    const bootcamps = await query;

    res.status(200).json({
        success: true,
        data: bootcamps
    })
})

export const Create = AsyncHander(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp
    })
})

export const Update = AsyncHander(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return  next(new ErrorResponse(`Bootcamp with id ${req.params.id} was nto found`))
    }

    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true
    })

    res.status(201).json({
        success: true,
        data: bootcamp
    })
})

export const Delete = AsyncHander(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return  next(new ErrorResponse(`Bootcamp with id ${req.params.id} was nto found`))
    }

    await bootcamp.deleteOne()

    res.status(201).json({
        success: true,
        data: {}
    })
})