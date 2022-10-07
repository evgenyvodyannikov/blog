import postModel from "../models/post.js"


export const create = async (req, res)  =>{
    try{
        const doc = new postModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        });

        const post = await doc.save()
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
          message: "Не удалось создать статью",
        });
    }
}