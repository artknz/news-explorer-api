const Article = require('../models/article');
const InternalServerError = require('../errors/internal-server-error');
const Forbidden = require('../errors/forbiddenError');
const NotFoundError = require('../errors/not-found-err');

const getArticles = (req, res, next) => {
  const { _id } = req.user;
  Article.find({ owner: _id })
    .then((articles) => res.status(200).send(articles))
    .catch(() => next(new InternalServerError('Ошибка сервера')));
};

const createArticle = (req, res, next) => {
  const { _id } = req.user;
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: _id,
  })
    .then((article) => res.status(200).send({ data: article }))
    .catch(() => next(new InternalServerError('Ошибка сервера')));
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;

  Article.findById(articleId).select('+owner')
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Статьи с таким id не обнаружена');
      }
      if (req.user._id !== article.owner.toString()) {
        throw new Forbidden('Удалять статью может только ее создатель');
      }
      Article.findByIdAndRemove(articleId).select('+owner')
        .then(() => {
          res.send({ data: article });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new NotFoundError('Статья с таким id не обнаружена'));
      } else {
        next(err);
      }
    });
};

module.exports = { getArticles, createArticle, deleteArticle };
