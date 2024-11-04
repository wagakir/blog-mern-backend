import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Не удалось получить статьи" });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .reduce((result, item) => {
        return result.includes(item) ? result : [...result, item];
      }, [])
      .slice(0, 5);
    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Не удалось получить статьи" });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    )
      .populate("user")
      .then((doc, err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось получить статью",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }
        return res.json(doc);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Не удалось получить статью" });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete(
      {
        _id: postId,
      },

      {
        returnDocument: "after",
      }
    ).then((doc, err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Не удалось удалить статью",
        });
      }
      if (!doc) {
        return res.status(404).json({
          message: "Статья не найдена",
        });
      }
      return res.json(doc);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Не удалось удалить статью" });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(","),
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Не удалось создать статью" });
  }
};
export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(","),
        user: req.userId,
      },
      {
        returnDocument: "after",
      }
    ).then((doc, err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Не удалось изменить статью",
        });
      }
      if (!doc) {
        return res.status(404).json({
          message: "Статья не найдена",
        });
      }
      return res.json({ msg: "" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Не удалось изменить статью" });
  }
};
